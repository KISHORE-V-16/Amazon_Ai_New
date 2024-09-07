const express = require('express');
const app = express();
const cors= require('cors');
const router = require('./router.jsx');
const middleware = require('./admin-authorization/middleware.jsx');

require('dotenv').config();

const port = 5005;
app.use(express.json()); 

app.use(cors({ 
    origin: '*',
    methods: ['POST','GET'], // allow only POST requests
    optionsSuccessStatus: 200 // some legacy browsers choke on 204
  }));

 /*  // Import the TensorFlow library
const tf = require('@tensorflow/tfjs');
const fs = require('fs');
const { createWorker } = require('tesseract.js');

async function imageToText() {
    // Load an image using TensorFlow.js
    const imageBuffer = fs.readFileSync('path/to/image.jpg');
    const tfImage = tf.node.decodeImage(imageBuffer);
    
    // Preprocess or manipulate the image with TensorFlow.js if needed
    // Example: Resize image
    const resizedImage = tf.image.resizeBilinear(tfImage, [newWidth, newHeight]);
    
    // Convert TensorFlow.js tensor to a buffer for tesseract.js
    const pngBuffer = tf.node.encodePng(resizedImage);

    // Pass the image buffer to tesseract.js for OCR
    const worker = createWorker();
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data: { text } } = await worker.recognize(pngBuffer);
    await worker.terminate();

    console.log('Detected text:', text);
}

imageToText()
    .catch(err => console.error(err));

// Print the predicted text
console.log(text); */


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.use('/api',router);
app.use('/admin',router);
 