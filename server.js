// Dependencies
const fs = require('fs')
const http = require('http')
const https = require('https')
const express = require('express')
const app = express();
const router = express.Router()
const multer = require('multer')
const upload = multer({dest: './uploads/'})
const morgan = require('morgan')
const tesseract = require('node-tesseract-ocr')

const ocr_config = {
    lang: 'eng',
    oem: 1,
    psm: 3,
}

const SSL_ENABLED = false;

// SSL Certificate
const privateKey  = fs.readFileSync('./certs/privkey.pem', 'utf8')
const certificate = fs.readFileSync('./certs/cert.pem', 'utf8')
const ca          = fs.readFileSync('./certs/chain.pem', 'utf8')

const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
}

app.use(morgan('combined'))

// Default route
app.use(router, (req, res) => {
    void (req);
    res.send('ai.algoritme.io API Server (ole@algoritme.io)')
})

// OCR Route (optical character recoginition)
router.post('/api/ocr', upload.single('image_file'), (req, res) => {
        //if(!req || !req.file)
        //    return res.json({'OCR API': {'ERROR': 'Missing upload image file'}})

        tesseract.recognize(req.file.path, ocr_config)
            .then(text => {
                return res.json({'OCR API': {'Result': text}})
            })
            .catch(error => {
                return res.json({'OCR API': {'ERROR': 'Could not recognize characters in image'}})
            })
})

// Simple test
router.get('/api/roll', (req, res) => {
    void (req)
    let x = Math.floor(Math.random() * ((6 - 1) + 1) + 1)
    let y = Math.floor(Math.random() * ((6 - 1) + 1) + 1)
    const dice = x + y
    return res.json({'Dice': {'Result': dice}})
})



// Starting API server
let server;
const port = 1337;

if (SSL_ENABLED) {
  server = https.createServer(credentials, app)
  server.listen(port, () => {
      console.log('HTTPS REST API running @ port: ' + port)
  })
} else {
  server = http.createServer(app)
  server.listen(port, () => {
      console.log('HTTPS REST API running @ port: ' + port)
  })
}
