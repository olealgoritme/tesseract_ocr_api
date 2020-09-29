// Dependencies
const fs = require('fs')
const http = require('http')
const https = require('https')
const express = require('express')

const app = express();
const router = express.Router()

const multer = require('multer')
const upload = multer({dest: './uploads/'})
//const phone = require('./phone_calls.js')

const tesseract = require("node-tesseract-ocr")
const ocr_config = {
    lang: "eng+no",
    oem: 1,
    psm: 3,
}


// Certificate
const privateKey = fs.readFileSync('/etc/letsencrypt/live/ai.algoritme.io/privkey.pem', 'utf8')
const certificate = fs.readFileSync('/etc/letsencrypt/live/ai.algoritme.io/cert.pem', 'utf8')
const ca = fs.readFileSync('/etc/letsencrypt/live/ai.algoritme.io/chain.pem', 'utf8')

const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
}

// Default route
app.use(router, (req, res) => {
    void (req);
    res.send('ai.algoritme.io API Server -@olealgoritme')
})

/**
 * Optical character recognition
 * */
router.post('/api/ocr', upload.single('image_file'), (req, res) => {
    tesseract.recognize(req.file.path, ocr_config)
        .then(text => {
            return res.json({'Image Character Recognition': {'Result': text}})
        })
        .catch(error => {
            void (error)
            return
        })
})


router.get('/api/roll', (req, res) => {
    void (req)
    let x = Math.floor(Math.random() * ((6 - 1) + 1) + 1)
    let y = Math.floor(Math.random() * ((6 - 1) + 1) + 1)
    const dice = x + y
    return res.json({'Dice': {'Result': dice}})
})



// Starting HTTPS servers
const httpsServer = https.createServer(credentials, app)
httpsServer.listen(1337, () => {
    console.log('HTTPS REST API running @ port 1337')
})
