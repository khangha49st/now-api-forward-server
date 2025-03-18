const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Configuration of the target server
const API_RAW_PLACE_DETAILS_URL = "https://wanderlog.com/api/placesAPI/getPlaceDetails/v2";
const API_PLACE_DETAILS_URL = "https://wanderlog.com/api/places/metadata";
const DEFAULT_REFERER = "https://wanderlog.com/";

// 1. Proxy middleware option for 'Raw place details'
const rawPlaceDetailsOptions = {
  target: API_RAW_PLACE_DETAILS_URL, // target host
  changeOrigin: true,      // needed for virtual hosted sites
  onProxyReq: (proxyReq, req, res) => {
    // Set Referer header
    const referers = ["https://google.com/", "https://facebook.com/", "https://x.com/", DEFAULT_REFERER];
    proxyReq.setHeader("Referer", referers[Math.floor(Math.random() * referers.length)]);
    
    // Random Accept-Language
    const languages = ["en-US,en;q=0.9", "fr-FR,fr;q=0.9"];
    proxyReq.setHeader("Accept-Language", languages[Math.floor(Math.random() * languages.length)]);
    proxyReq.setHeader("Accept-Encoding", "gzip, deflate, br");
     // Random User-Agent
     const userAgents = [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/91.0.4472.124 Safari/537.36",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/92.0.4515.107 Safari/537.36",
      "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/88.0.4324.181 Mobile Safari/537.36",
    ];
    const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
    proxyReq.setHeader("User-Agent", randomUserAgent);
  },
};

// 2. Proxy middleware option for 'Place details'
const placeDetailsOptions = {
  target: API_PLACE_DETAILS_URL, // target host
  changeOrigin: true,      // needed for virtual hosted sites
  onProxyReq: (proxyReq, req, res) => {
    // Set Referer header
    const referers = ["https://google.com/", "https://facebook.com/", "https://x.com/", DEFAULT_REFERER];
    proxyReq.setHeader("Referer", referers[Math.floor(Math.random() * referers.length)]);

    // Random Accept-Language
    const languages = ["en-US,en;q=0.9", "fr-FR,fr;q=0.9"];
    proxyReq.setHeader("Accept-Language", languages[Math.floor(Math.random() * languages.length)]);
    proxyReq.setHeader("Accept-Encoding", "gzip, deflate, br");
     // Random User-Agent
     const userAgents = [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/91.0.4472.124 Safari/537.36",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/92.0.4515.107 Safari/537.36",
      "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/88.0.4324.181 Mobile Safari/537.36",
    ];
    const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
    proxyReq.setHeader("User-Agent", randomUserAgent);
  },
};

// Create the proxy middleware for (1)
const apiRawPlaceDetailsProxy = createProxyMiddleware(rawPlaceDetailsOptions);
// Create the proxy middleware for (2)
const apiPlaceDetailsProxy = createProxyMiddleware(placeDetailsOptions);

app.use(express.static('public'));

// Route for the root path
app.get('/', (req, res) => {
  // Construct the absolute path to the HTML file
  const filePath = path.join(__dirname, 'public', 'index.html');

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
