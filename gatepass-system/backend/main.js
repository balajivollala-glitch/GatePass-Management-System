// main.js
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;
const DATA_FILE = 'data.json';

app.use(cors());
app.use(bodyParser.json());

// Read data from file
function readData() {
  if (!fs.existsSync(DATA_FILE)) return { requests: [] };
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

// Write data to file
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Student submits request
app.post('/request', (req, res) => {
  const data = readData();
  const request = {
    id: Date.now(),
    ...req.body,
    status: 'pending',
    remarks: ''
  };
  data.requests.push(request);
  writeData(data);
  res.json({ message: 'Request submitted successfully', request });
});

// Moderator gets all requests
app.get('/requests', (req, res) => {
  const data = readData();
  res.json(data.requests);
});

// Moderator updates request
app.post('/update', (req, res) => {
  const { id, status, remarks } = req.body;
  const data = readData();
  const reqIndex = data.requests.findIndex(r => r.id === id);

  if (reqIndex === -1) return res.status(404).json({ message: 'Request not found' });

  data.requests[reqIndex].status = status;
  data.requests[reqIndex].remarks = remarks;
  writeData(data);

  res.json({ message: 'Status updated', request: data.requests[reqIndex] });
});

// Gatekeeper check
app.get('/check/:id', (req, res) => {
  const data = readData();
  const request = data.requests.find(r => r.id == req.params.id);
  if (!request) return res.status(404).json({ message: 'Not found' });
  res.json(request);
});

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
