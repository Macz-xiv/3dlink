import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.esm.min.js';

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

const CONTRACT_ADDRESS = 'YOUR_ETHERLINK_CONTRACT_ADDRESS'; // ✅ Replace with actual address
const PROVIDER_URL = 'https://node.mainnet.etherlink.com';  // Or testnet endpoint

export default async function mintNFT(tokenURI) {
  if (typeof window.ethereum === 'undefined') {
    alert('🦊 MetaMask not detected.');
    return null;
  }

  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.providers.Web3Provider(window.ethereum); // Uses injected wallet
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

    const tx = await contract.mintNFT(await signer.getAddress(), tokenURI);
    await tx.wait();
    console.log('✅ Minted:', tx);
    return tx;
  } catch (error) {
    console.error('❌ Mint Error:', error);
    return null;
  }
}
