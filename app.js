const contractAddress = "0x355876A4b0A4F3f97D54900441AeDD7719869601"; // Paste your copied address
const abi = [
  "function mintNFT(string memory tokenURI) public",
];

let signer;

async function connectWallet() {
  if (!window.ethereum) return alert("Install MetaMask!");

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();

  const address = await signer.getAddress();
  document.getElementById("status").innerText = `Connected: ${address}`;
}

async function mintGlbNFT() {
  if (!signer) return alert("Wallet not connected!");

  const tokenURI = document.getElementById("tokenURI").value.trim();
  if (!tokenURI.endsWith(".glb")) return alert("Only .glb URLs allowed!");

  const contract = new ethers.Contract(contractAddress, abi, signer);

  try {
    const tx = await contract.mintNFT(tokenURI);
    document.getElementById("status").innerText = "Minting... waiting for confirmation...";
    await tx.wait();
    document.getElementById("status").innerText = "✅ NFT Minted!";
  } catch (err) {
    console.error(err);
    document.getElementById("status").innerText = "❌ Minting failed";
  }
}