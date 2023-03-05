const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = process.env.PORT || 3001

// Middleware to parse JSON request body
app.use(bodyParser.json());
app.use(cors());

app.use(require('./routes/login'))
app.use(require('./routes/protected'))


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
