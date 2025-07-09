const JWT = 'YOUR_FULL_JWT_HERE'; // Scoped JWT from Pinata

export default async function uploadToIPFS(file) {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: { Authorization: `Bearer ${JWT}` },
      body: formData
    });

    const data = await response.json();
    console.log('✅ IPFS Upload:', data);
    return data;
  } catch (err) {
    console.error('❌ IPFS Error:', err);
    return null;
  }
}
