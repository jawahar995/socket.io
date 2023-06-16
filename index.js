const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const axios = require('axios');

app.use(express.static(path.join(__dirname, '..', 'client-socket')));

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('message', async (data) => {
    try {
      // const location = await fetchAddress(data.location.latitude, data.location.longitude);
      console.log('Received message:', {...data});
    } catch (error) {
      console.error(error);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

app.get('/', (req, res) => {
  res.send('<h1> serices loaded </h1>');
});
async function fetchAddress(latitude, longitude) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;

    const response = await axios.get(url);
    const addressData = response.data;
    return {
      'osm_id': addressData.osm_id,
      'city': addressData.address.city,
      'postcode': addressData.address.postcode,
      'state': addressData.address.state,
      'country': addressData.address.country,
      'country_code': addressData.address.country_code
    };
  } catch (error) {
    console.error(error);
  }
}

const port = 80;
http.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


