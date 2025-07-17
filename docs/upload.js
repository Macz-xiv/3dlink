const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI2MDU0ZjI0Ni1jMmZmLTRlZjQtYjVhZC1kNDE5NDQ2NGMyYTUiLCJlbWFpbCI6Im1hY3oueGl2QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI1YTUwMTFkY2FkODMxYzFkMzFlNyIsInNjb3BlZEtleVNlY3JldCI6IjI4MTQwMGNiYmI5ODMwNWNhYzk1YTU0NGI1NzE4YWIxYzU0NDI2OTAwZGQ5NzgyMWQ1NzdlZDI4ZGE3YTkyZTEiLCJleHAiOjE3ODQzMjE1ODl9.LWWZRPXfiCkKcEbJQvxQ8Ie0idHh-CKNjmoWjTd-VGE';

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

    const data = await response.json();
    console.log('✅ IPFS Upload:', data);
    return data;
  } catch (err) {
    console.error('❌ IPFS Error:', err);
    return null;
  }
}
