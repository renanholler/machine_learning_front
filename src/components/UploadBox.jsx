import React from 'react';
import { useDropzone } from 'react-dropzone';
import { FaPaperclip } from 'react-icons/fa';
import '../style/uploadBox.css';

const UploadBox = ({ onDrop, fileName }) => {
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="dropzone">
      <input {...getInputProps()} />
        {fileName ? <p>{fileName}</p> : <p>Drop files here to upload...</p>}
      <FaPaperclip size={30} />
    </div>
  );
};

export default UploadBox;
