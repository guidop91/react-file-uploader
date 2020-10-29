import React, { Fragment, useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState('');
  const [fileName, setFileName] = useState('Choose File');
  const [uploadedFile, setUploadedFile] = useState({});

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
      });
      const { fileName, filePath } = res.data;
      setUploadedFile({ fileName, filePath });
    } catch (error) {
      if (error.response.status === 400) {
        console.log(error.response.data.msg);
      } else {
        console.log('There was a problem with the server.');
      }
    }
  };

  return (
    <Fragment>
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
            <img src={uploadedFile.filePath} alt="your uploaded pic" />
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default FileUpload;
