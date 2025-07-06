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
  const PINATA_API_KEY = 'YOUR_PINATA_API_KEY';
  const PINATA_API_SECRET = 'YOUR_PINATA_API_SECRET';
  // ============================================

  // Pinata requires a FormData POST
  const formData = new FormData();
  formData.append('file', fileInput, fileInput.name);

  try {
    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        // You must NOT set Content-Type here; browser will set proper boundary for FormData
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
