import React, { Fragment, useState } from 'react';
import axios from 'axios';
import Message from './Message';
import ProgressBar from './ProgressBar';

const FileUpload = () => {
  // Hooks
  const [file, setFile] = useState('');
  const [fileName, setFileName] = useState('Choose File');
  const [uploadedFile, setUploadedFile] = useState({});
  const [message, setMessage] = useState('');
  const [percentage, setPercentage] = useState(0);

  const onChangeHandler = (event) => {
    setFile(event.target.files[0]);
    setFileName(event.target.files[0].name);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: ({ loaded, total }) => {
          setPercentage(Math.round((loaded / total) * 100));
          setTimeout(() => setPercentage(0), 10000);
        },
      });
      const { fileName, filePath } = res.data;
      setUploadedFile({ fileName, filePath });
      setFileName('');
      setMessage('File uploaded!');
    } catch (error) {
      if (error.response.status === 400) {
        setMessage(error.response.data.msg);
      } else {
        setMessage('There was a problem with the server.');
      }
    }
  };

  return (
    <Fragment>
      {message && <Message msg={message} />}
      <form onSubmit={onSubmitHandler}>
        <div className="custom-file mb-4">
          <input
            type="file"
            className="custom-file-input"
            id="customFile"
            onChange={onChangeHandler}
          />
          <label className="custom-file-label" htmlFor="customFile">
            {fileName}
          </label>
        </div>
        <ProgressBar percentage={percentage} />
        <input
          type="submit"
          value="Upload"
          className="btn btn-primary mt-4 btn-block"
        />
      </form>
      {uploadedFile.fileName && (
        <div className="row mt-5">
          <div className="col-md-6 m-auto">
            <h3 className="text-center">{uploadedFile.fileName}</h3>
            <img
              className="uploaded-img"
              src={uploadedFile.filePath}
              alt="your uploaded pic"
            />
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default FileUpload;
