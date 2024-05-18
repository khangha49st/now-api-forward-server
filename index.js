const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Configuration of the target server
const API_RAW_PLACE_DETAILS_URL = "https://wanderlog.com/api/placesAPI/getPlaceDetails/v2";
const API_PLACE_DETAILS_URL = "https://wanderlog.com/api/places/metadata";

// 1. Proxy middleware option for 'Raw place details'
const rawPlaceDetailsOptions = {
  target: API_RAW_PLACE_DETAILS_URL, // target host
  changeOrigin: true,      // needed for virtual hosted sites
};

// 2. Proxy middleware option for 'Place details'
const placeDetailsOptions = {
    target: API_PLACE_DETAILS_URL, // target host
    changeOrigin: true,      // needed for virtual hosted sites
  };

// Create the proxy middleware for (1)
const apiRawPlaceDetailsProxy = createProxyMiddleware(rawPlaceDetailsOptions);
// Create the proxy middleware for (2)
const apiPlaceDetailsProxy = createProxyMiddleware(placeDetailsOptions);


// Route for the root path
app.get('/', (req, res) => {
  // Construct the absolute path to the HTML file
  const filePath = path.join(__dirname, 'welcome.html');

  // Read the HTML file asynchronously
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading welcome.html:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.send(data);
  });
});

// Mount the proxy middleware
app.use('/raw-place-details', apiRawPlaceDetailsProxy);
app.use('/place-details', apiPlaceDetailsProxy);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
