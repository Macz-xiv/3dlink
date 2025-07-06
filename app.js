const contractAddress = "0x355876A4b0A4F3f97D54900441AeDD7719869601";
const abi = ["function mintNFT(string memory tokenURI) public"];

let signer;
const allowed3DExts = [".glb", ".gltf", ".obj", ".fbx", ".dae", ".3ds", ".stl"];
const NFTSTORAGE_TOKEN = "80a9f3c0.79274e4a77514ccc85c2cdddf8190ccd"; // <-- Your nft.storage API key

async function connectWallet() {
  if (!window.ethereum) return alert("MetaMask not found. Please install it.");
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  const address = await signer.getAddress();
  document.getElementById("status").innerText = `✅ Connected: ${address}`;
}

async function mintGlbNFT() {
  if (!signer) return alert("Please connect your wallet first.");
  const tokenURI = document.getElementById("tokenURI").value.trim();
  if (tokenURI.startsWith("blob:")) {
    alert("You must upload your file to IPFS or a public URL before minting. Blob URLs cannot be used for on-chain NFTs.");
    return;
  }
  if (!allowed3DExts.some(ext => tokenURI.toLowerCase().endsWith(ext))) {
    return alert("Invalid 3D file or URL.");
  }
  const contract = new ethers.Contract(contractAddress, abi, signer);
  try {
    const tx = await contract.mintNFT(tokenURI);
    document.getElementById("status").innerText = "⏳ Minting... please wait.";
    await tx.wait();
    document.getElementById("status").innerText = "✅ NFT minted successfully!";
  } catch (err) {
    console.error("❌ Minting failed:", err);
    document.getElementById("status").innerText = "❌ Minting failed. Check console.";
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
  status.innerText = "⏳ Uploading to IPFS (nft.storage)...";

  try {
    // nft.storage API expects the file itself, not FormData
    const res = await fetch("https://api.nft.storage/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NFTSTORAGE_TOKEN}`,
      },
      body: fileInput,
    });

    if (!res.ok) throw new Error("Upload failed: " + res.statusText);
    const data = await res.json();
    const cid = data.value?.cid;
    if (!cid) throw new Error("No CID returned from nft.storage");

    const url = `https://ipfs.io/ipfs/${cid}/${fileInput.name}`;
    input.value = url;
    status.innerText = `✅ Uploaded to IPFS: ${url}`;
  } catch (err) {
    console.error("❌ IPFS upload failed:", err);
    status.innerText = "❌ IPFS upload failed. Check console.";
  }
}

// Drag-and-Drop
document.addEventListener("DOMContentLoaded", () => {
  const dropzone = document.getElementById("dropzone");
  const input = document.getElementById("tokenURI");
  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.style.borderColor = "#4CAF50";
  });
  dropzone.addEventListener("dragleave", () => {
    dropzone.style.borderColor = "#aaa";
  });
  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.style.borderColor = "#aaa";
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const lowerName = file.name.toLowerCase();
    if (!allowed3DExts.some(ext => lowerName.endsWith(ext))) {
      alert("Only 3D files allowed: " + allowed3DExts.join(", "));
      return;
    }
    const url = URL.createObjectURL(file);
    input.value = url;
    window.dropped3DFile = file;
    document.getElementById("status").innerText = `📦 File ready: ${file.name} (${file.type || 'unknown type'})`;
  });
});
