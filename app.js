const contractAddress = "0x355876A4b0A4F3f97D54900441AeDD7719869601"; // Replace with your contract address
const abi = ["function mintNFT(string memory tokenURI) public"];

let signer;

// Connect MetaMask wallet
async function connectWallet() {
  if (!window.ethereum) return alert("MetaMask not found. Please install it.");

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();

  const address = await signer.getAddress();
  document.getElementById("status").innerText = `✅ Connected: ${address}`;
}

// Mint NFT using tokenURI
async function mintGlbNFT() {
  if (!signer) return alert("Please connect your wallet first.");
  
  const tokenURI = document.getElementById("tokenURI").value.trim();
  if (!tokenURI.endsWith(".glb") && !tokenURI.startsWith("blob:")) {
    return alert("Invalid .glb file or URL.");
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

// Drag-and-Drop functionality
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
    if (!file || !file.name.endsWith(".glb")) {
      alert("Only .glb files allowed.");
      return;
    }

    const url = URL.createObjectURL(file);
    input.value = url;
    document.getElementById("status").innerText = `📦 File ready: ${file.name}`;
  });
});
