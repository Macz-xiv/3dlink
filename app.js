// ✅ Your full JWT goes here — make sure it's well-formed (3 segments, no breaks)
const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb...<signature>'; // Replace with full token

export default async function uploadToIPFS(file) {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${JWT}`
        // No need to manually set content-type — fetch handles FormData
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Upload failed:', errorData);
      throw new Error(`Upload failed → ${JSON.stringify(errorData)}`);
    }

    const result = await response.json();
    console.log('🚀 Upload success:', result);
    return result;

  } catch (error) {
    console.error('❌ IPFS error:', error.message);
    return null;
  }
}
