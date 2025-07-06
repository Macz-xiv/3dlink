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

  const PINATA_API_KEY = "your-key"; // 0fbe41ce2bba12f9909f
  const PINATA_SECRET_API_KEY = "your-secret"; // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI2MDU0ZjI0Ni1jMmZmLTRlZjQtYjVhZC1kNDE5NDQ2NGMyYTUiLCJlbWFpbCI6Im1hY3oueGl2QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIwZmJlNDFjZTJiYmExMmY5OTA5ZiIsInNjb3BlZEtleVNlY3JldCI6ImE2MTdlZmQ5Y2I3YmM2YjQzZDNjYzlmYmIyYmM1NTQ2ZjM4NTIwNzY4YWUwZTE0MWMyZDAwYTVjOTQ0Yzg4MzYiLCJleHAiOjE3ODMzMzg1OTR9.GS8-JyFeRl_pcMm2dXmmxIAIjJMEjyk-u0L7I1XrKTc

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
    const url =
