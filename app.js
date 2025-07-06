const contractAddress = "0x355876A4b0A4F3f97D54900441AeDD7719869601";
const abi = ["function mintNFT(string memory tokenURI) public"];

let signer;
const allowed3DExts = [".glb", ".gltf", ".obj", ".fbx", ".dae", ".3ds", ".stl"];

async function connectWallet() {
  if (!window.ethereum) {
    alert("MetaMask not found. Please install it.");
    return;
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  const address = await signer.getAddress();
  document.getElementById("status").innerText = `✅ Connected: ${address}`;
}

async function mintGlbNFT() {
  if (!signer) {
    alert("Please connect your wallet first.");
    return;
  }

  const tokenURI = document.getElementById("tokenURI").value.trim();
  if (tokenURI.startsWith("blob:")) {
    alert("Upload your file to IPFS or a public URL before minting.");
    return;
  }

  if (!allowed3DExts.some(ext => tokenURI.toLowerCase().endsWith(ext))) {
    alert("Invalid file type.");
    return;
  }

  const contract = new ethers.Contract(contractAddress, abi, signer);
  try {
    const tx = await contract.mintNFT(tokenURI);
    document.getElementById("status").innerText = "⏳ Minting...";
    await tx.wait();
    document.getElementById("status").innerText = "✅ NFT minted!";
  } catch (err) {
    console.error("❌ Minting error:", err);
    document.getElementById("status").innerText = "❌ Minting failed. See console.";
  }
}

async function uploadToIPFS() {
  const input = document.getElementById("tokenURI");
  const status = document.getElementById("status");
  const fileInput = window.dropped3DFile;

  if (!fileInput) {
    alert("Drop a 3D file first.");
    return;
  }

  status.innerText = "⏳ Uploading to IPFS...";

  const PINATA_API_KEY = "your-key"; // Replace with your actual key
  const PINATA_SECRET_API_KEY = "your-secret"; // Replace with your actual secret

  const formData = new FormData();
  formData.append("file", fileInput, fileInput.name);

  try {
    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        "pinata_api_key": PINATA_API_KEY,
        "pinata_secret_api_key": PINATA_SECRET_API_KEY
      },
      body: formData
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Upload failed → ${text}`);
    }

    const data = await res.json();
    const cid = data.IpfsHash;
    const url = `https://gateway.pinata.cloud/ipfs/${cid}/${fileInput.name}`;
    input.value = url;
    status.innerText = `✅ Uploaded to IPFS: ${url}`;
  } catch (err) {
    console.error("❌ IPFS error:", err);
    status.innerText = "❌ Upload failed.";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const dropzone = document.getElementById("dropzone");
  const input = document.getElementById("tokenURI");

  dropzone.addEventListener("dragover", e => {
    e.preventDefault();
    dropzone.style.borderColor = "#4CAF50";
  });

  dropzone.addEventListener("dragleave", () => {
    dropzone.style.borderColor = "#aaa";
  });

  dropzone.addEventListener("drop", e => {
    e.preventDefault();
    dropzone.style.borderColor = "#aaa";

    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (!allowed3DExts.some(ext => file.name.toLowerCase().endsWith(ext))) {
      alert("Only 3D files allowed.");
      return;
    }

    const url = URL.createObjectURL(file);
    input.value = url;
    window.dropped3DFile = file;
    document.getElementById("status").innerText = `📦 Ready: ${file.name}`;
  });
});
