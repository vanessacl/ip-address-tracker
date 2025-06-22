// build.js
const fs = require('fs')
const dotenv = require('dotenv')
const path = require('path')

// Load .env file
const env = dotenv.parse(fs.readFileSync(path.resolve(__dirname, '.env')))

// Read script.js template
let scriptContent = fs.readFileSync('js/script.js', 'utf8')

// Replace a placeholder or append env variable
scriptContent = `window.env = ${JSON.stringify(env)};\n${scriptContent}`

// Write to a new file or overwrite
fs.writeFileSync('js/script.built.js', scriptContent, 'utf8')
console.log('Build completed. Use js/script.built.js in index.html')
