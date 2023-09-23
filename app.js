const express = require('express');
require('dotenv').config();

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

const app = express();

app.listen(PORT, () => {
  console.log(`Application listening on port ${PORT}`);
});
