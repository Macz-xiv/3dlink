const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// ✅ Replace with your file path
const filePath = path.resolve('C:/Users/HP/Desktop/1/HelloEtherlink.glb');

// ✅ Your new JWT token
const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // (truncated for security; paste your full token here)

async function uploadToIPFS() {
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));

  try {
    const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', form, {
      headers: {
        Authorization: `Bearer ${JWT}`,
        ...form.getHeaders()
      }
    });
    console.log('🚀 File pinned successfully:', res.data);
  } catch (error) {
    console.error('❌ Upload failed:', error.response?.data || error.message);
  }
}

uploadToIPFS();
