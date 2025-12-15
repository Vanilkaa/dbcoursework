const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/apiRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/index.html'));
});

app.use('/api', apiRoutes);

module.exports = app;