const contractAddress = "0x355876A4b0A4F3f97D54900441AeDD7719869601";
const abi = ["function mintNFT(string memory tokenURI) public"];

let signer;
const allowed3DExts = [".glb", ".gltf", ".obj", ".fbx", ".dae", ".3ds", ".stl"];

// ✅ Use a properly scoped JWT token from Pinata
const JWT = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI2MDU0ZjI0Ni1jMmZmLTRlZjQtYjVhZC1kNDE5NDQ2NGMyYTUiLCJlbWFpbCI6Im1hY3oueGl2QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIxZjE3NzM4ZTU3NGJhNTFjZWFiYiIsInNjb3BlZEtleVNlY3JldCI6IjhjZGIzZTRmMWQzNmI1ZTJjNjkxNDA4MDU1MDdhYzhjYmE2YjBkNDM1YmExZWZmOGJlZTQ1ODQyYjllMzM2ZjQiLCJleHAiOjE3ODMzNjc1MDF9.5Z3ovs6iI0w6Z55DBLz5s6aIk-TAYr058SC25zZEtes`;

async function connectWallet() {
  if (!window.ethereum) {
    alert("🦊 Please install MetaMask.");
    return;
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();

  const address = await signer.getAddress();
  document.getElementById("status").innerText = `✅ Wallet connected: ${address}`;
}

async function uploadToIPFS() {
  const status = document.getElementById("status");
  const input = document.getElementById("tokenURI");
  const file = window.dropped3DFile;

  if (!file) {
    alert("📂 No file found. Drop one in the box.");
    return;
  }

  status.innerText = "⏳ Uploading to IPFS...";

  const formData = new FormData();
  formData.append("file", file, file.name);

  try {
    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${JWT}`
      },
      body: formData
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Upload failed: ${text}`);
    }

    const data = await res.json();
    const cid = data.IpfsHash;
    const url = `https://gateway.pinata.cloud/ipfs/${cid}/${file.name}`;

    input.value = url;
    status.innerText = `✅ Uploaded: ${url}`;
  } catch (err) {
    console.error("❌ IPFS upload error:", err);
    status.innerText = "❌ Failed to upload to IPFS.";
  }
}

async function mintGlbNFT() {
  if (!signer) {
    alert("⚠️ Wallet not connected.");
    return;
  }

  const input = document.getElementById("tokenURI");
  const tokenURI = input.value.trim();
  const status = document.getElementById("status");

  if (!tokenURI || tokenURI.startsWith("blob:")) {
    alert("🚫 Invalid tokenURI. Upload to IPFS first.");
    return;
  }

  if (!allowed3DExts.some(ext => tokenURI.toLowerCase().endsWith(ext))) {
    alert("🚫 Unsupported file format.");
    return;
  }

  const contract = new ethers.Contract(contractAddress, abi, signer);

  try {
    const tx = await contract.mintNFT(tokenURI);
    status.innerText = "⏳ Minting NFT...";
    await tx.wait();
    status.innerText = "✅ NFT successfully minted!";
  } catch (err) {
    console.error("❌ Mint error:", err);
    status.innerText = "❌ Failed to mint NFT.";
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
      alert("⚠️ Only 3D files allowed.");
      return;
    }

    const url = URL.createObjectURL(file);
    input.value = url;
    window.dropped3DFile = file;
    document.getElementById("status").innerText = `📦 Ready to upload: ${file.name}`;
  });
});
