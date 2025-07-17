import uploadToIPFS from './upload.js';
import mintNFT from './mint.js';

const button = document.getElementById('uploadMintBtn');
const fileInput = document.getElementById('fileInput');
const status = document.getElementById('status');

button.addEventListener('click', async () => {
  const file = fileInput.files[0];
  if (!file) {
    status.textContent = '❌ No file selected.';
    return;
  }

  status.textContent = 'Uploading to IPFS...';
  const ipfsData = await uploadToIPFS(file);

  if (ipfsData?.IpfsHash) {
    const tokenURI = `https://gateway.pinata.cloud/ipfs/${ipfsData.IpfsHash}`;
    status.textContent = 'Minting NFT...';
    const tx = await mintNFT(tokenURI);
    status.textContent = tx ? '✅ NFT Minted!' : '❌ Mint failed.';
  } else {
    status.textContent = '❌ IPFS upload failed.';
  }
});
