import React, { useState } from 'react';
import { uploadData } from '@aws-amplify/storage';
import { getCurrentUser } from 'aws-amplify/auth';

function Appupload() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (event) => {
    console.log('File selected:', event.target.files[0]);
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    console.log('Upload button clicked');

    if (!selectedFile) {
      console.error('No file selected');
      return;
    }

    try {
      console.log('Fetching current authenticated user...');
      const user = await getCurrentUser();
      console.log('Current user:', user);

      console.log('Starting upload...');
      const result = await uploadData({
        key: selectedFile.name, // you can change to 'eCard.pdf' if needed
        data: selectedFile,
        options: {
          contentType: selectedFile.type,
          accessLevel: 'public',
        },
      });

      console.log('Upload successful:', result);
      setSelectedFile(null);
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileSelect} />
      <button onClick={handleUpload}>Upload PDF</button>
    </div>
  );
}

export default Appupload;
