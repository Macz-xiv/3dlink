// ✅ Replace this with your full JWT securely
const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI2...GG4'; // No line breaks or trailing commas

export default async function uploadToIPFS(file) {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${JWT}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Upload failed → ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('🚀 IPFS response:', data);
    return data;

  } catch (error) {
    console.error('❌ IPFS error:', error.message);
    return null;
  }
}
