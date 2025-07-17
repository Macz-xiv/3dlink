import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.esm.min.js';

// 🔧 Replace with your actual smart contract address
const CONTRACT_ADDRESS = 'YOUR_ETHERLINK_CONTRACT_ADDRESS';

const contractABI = [
  {
    inputs: [
      { internalType: 'address', name: 'recipient', type: 'address' },
      { internalType: 'string', name: 'tokenURI', type: 'string' }
    ],
    name: 'mintNFT',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
];

export default async function mintNFT(tokenURI) {
  if (typeof window.ethereum === 'undefined') {
    alert('🦊 MetaMask not detected. Please install or enable it.');
    return null;
  }

  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const recipient = window.ethereum.selectedAddress;

    console.log('👛 Minting to:', recipient);

    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
    const tx = await contract.mintNFT(recipient, tokenURI);

    await tx.wait();
    console.log('✅ NFT Minted:', tx);
    return tx;

  } catch (error) {
    console.error('❌ Mint Error:', error);
    return null;
  }
}
