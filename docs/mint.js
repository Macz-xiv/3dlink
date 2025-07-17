import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.esm.min.js';
import contractABI from './abi.json' assert { type: 'json' };

const CONTRACT_ADDRESS = 'YOUR_ETHERLINK_CONTRACT_ADDRESS'; // ✅ Replace this!
const PROVIDER_URL = 'https://node.mainnet.etherlink.com';  // or testnet if you're testing

export default async function mintNFT(tokenURI) {
  try {
    const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL);
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const signer = provider.getSigner(accounts[0]);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

    const tx = await contract.mintNFT(accounts[0], tokenURI);
    await tx.wait();
    console.log('✅ Minted:', tx);
    return tx;
  } catch (error) {
    console.error('❌ Mint Error:', error);
    return null;
  }
}
