// ✅ Paste your full JWT exactly here — it must be a single-line string with three segments
const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb25...k3wtNAD6nDGk1gLTLpEc684MvFOe-xEcuYHgbY_eGG4'; // Replace with full token

export default async function uploadToIPFS(file) {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${JWT}`
        // Content-Type is automatically handled when sending FormData
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Upload failed:', errorData);
      throw new Error(`Upload failed → ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('🚀 Upload successful:', data);
    return data;

  } catch (error) {
    console.error('❌ IPFS error:', error.message);
    return null;
  }
}
