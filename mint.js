import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.esm.min.js';
import contractABI from './abi.json' assert { type: 'json' };

const CONTRACT_ADDRESS = 'YOUR_CONTRACT_ADDRESS_ON_ETHERLINK';

export default async function mintNFT(tokenURI) {
  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    const provider = new ethers.providers.Web3Provider(window.ethereum);
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
