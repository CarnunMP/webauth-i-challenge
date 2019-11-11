const express = require('express');

const server = express();
const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`\n* Server listenin on port ${port} *\n`);
});