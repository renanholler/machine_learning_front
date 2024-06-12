import React from 'react';
import PropTypes from 'prop-types';
import '../style/uploadButton.css';

const UploadButton = ({ text, onClick }) => {
  return (
    <button className="custom-button" onClick={onClick}>
      {text}
    </button>
  );
};

UploadButton.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default UploadButton;