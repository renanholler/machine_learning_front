import axios from 'axios';
import React, { useState } from 'react';
import Modal from 'react-modal';
import ResultsTable from './components/ResultsTable';
import UploadBox from './components/UploadBox';
import UploadButton from './components/UploadButton';
import './style/App.css';

Modal.setAppElement('#root');

function App() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [clusterOptions, setClusterOptions] = useState({
    method: 'elbow',
    usePca: false,
    nClusters: null
  });

  const handleDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const handleOptionChange = (option, value) => {
    setClusterOptions({
      ...clusterOptions,
      [option]: value
    });
  };

  const handleUpload = async (endpoint) => {
    if (!file) {
      alert('Favor selecionar um arquivo!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('method', clusterOptions.method);
    formData.append('usePca', clusterOptions.usePca);
    if (clusterOptions.method === 'manual' && clusterOptions.nClusters) {
      formData.append('nClusters', clusterOptions.nClusters);
    }

    try {
      const response = await axios.post(`http://localhost:5001/${endpoint}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResponse(response.data);
      closeModal();
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleClassification = () => {
    handleUpload('classify');
  };

  const openModal = () => {
    if (!file) {
      alert('Favor selecionar um arquivo!');
      return;
    }
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleGrouping = () => {
    handleUpload('cluster');
  };

  return (
    <div className="App">
      <h1>Upload File and Process</h1>
      <div className="content">
        <UploadBox onDrop={handleDrop} fileName={file ? file.name : null} />
        <div className="buttons">
          <UploadButton text="Classificação" onClick={handleClassification} />
          <UploadButton text="Agrupamento" onClick={openModal} />
        </div>
      </div>
      {response && (
        <div className="response-container">
          <h2>Results</h2>
          <ResultsTable data={response} />
        </div>
      )}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Cluster Options"
        className="Modal"
        overlayClassName="Overlay"
      >
        <div className="modal-content">
          <div>
            <h2>Escolha o Método de Agrupamento:</h2>
            <select
              value={clusterOptions.method}
              onChange={(e) => handleOptionChange('method', e.target.value)}
            >
              <option value="elbow">Elbow</option>
              <option value="coeficiente">Coeficiente de Silhueta</option>
              <option value="manual">Manual</option>
            </select>
            {clusterOptions.method === 'manual' && (
              <div>
                <h2>Informe o Número de Clusters:</h2>
                <input
                  type="number"
                  min={1}
                  value={clusterOptions.nClusters || 1}
                  onChange={(e) => handleOptionChange('nClusters', e.target.value)}
                />
              </div>
            )}
            <h2>Usar PCA?</h2>
            <label>
              <input
                type="radio"
                value={true}
                checked={clusterOptions.usePca === true}
                onChange={() => handleOptionChange('usePca', true)}
              />
              Sim
            </label>
            <label>
              <input
                type="radio"
                value={false}
                checked={clusterOptions.usePca === false}
                onChange={() => handleOptionChange('usePca', false)}
              />
              Não
            </label>
          </div>
        </div>
        <div className="modal-buttons">
          <button onClick={handleGrouping}>Enviar</button>
        </div>
      </Modal>
    </div>
  );
}

export default App;