const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');

const app = express();

app.use(fileUpload());

// Upload endpoint
app.post('/upload', (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file has been uploaded' });
  }

  const { file } = req.files;
  file.name = file.name.replace(/\s/g, '_');
  const uploadsPath = `${__dirname}/client/public/uploads`;
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath);
  }
  file.mv(`${uploadsPath}/${file.name}`, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
  });
});

app.listen(5000, () => console.log('Server up and running!'));
