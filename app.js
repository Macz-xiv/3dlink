async function uploadToIPFS() {
  const input = document.getElementById("tokenURI");
  const status = document.getElementById("status");
  const fileInput = window.dropped3DFile;
  if (!fileInput) {
    alert("Drop a 3D file first.");
    return;
  }
  status.innerText = "⏳ Uploading to IPFS (Pinata)...";

  // ==== PASTE YOUR PINATA CREDENTIALS HERE ====
  const PINATA_API_KEY = '0fbe41ce2bba12f9909f';
  const PINATA_API_SECRET = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI2MDU0ZjI0Ni1jMmZmLTRlZjQtYjVhZC1kNDE5NDQ2NGMyYTUiLCJlbWFpbCI6Im1hY3oueGl2QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIwZmJlNDFjZTJiYmExMmY5OTA5ZiIsInNjb3BlZEtleVNlY3JldCI6ImE2MTdlZmQ5Y2I3YmM2YjQzZDNjYzlmYmIyYmM1NTQ2ZjM4NTIwNzY4YWUwZTE0MWMyZDAwYTVjOTQ0Yzg4MzYiLCJleHAiOjE3ODMzMzg1OTR9.GS8-JyFeRl_pcMm2dXmmxIAIjJMEjyk-u0L7I1XrKTc';
  // ============================================

  const formData = new FormData();
  formData.append('file', fileInput, fileInput.name);

  try {
    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_API_SECRET
      },
      body: formData,
    });

    if (!res.ok) throw new Error("Upload failed: " + res.statusText);
    const data = await res.json();
    const cid = data.IpfsHash;
    if (!cid) throw new Error("No CID returned from Pinata");

    const url = `https://gateway.pinata.cloud/ipfs/${cid}/${fileInput.name}`;
    input.value = url;
    status.innerText = `✅ Uploaded to IPFS: ${url}`;
  } catch (err) {
    console.error("❌ Pinata IPFS upload failed:", err);
    status.innerText = "❌ Pinata IPFS upload failed. Check console.";
  }
}
