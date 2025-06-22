// build.js
const fs = require('fs')
const dotenv = require('dotenv')
const path = require('path')

// Load .env file
const env = dotenv.parse(fs.readFileSync(path.resolve(__dirname, '.env')))
const apiKey = env.API_KEY

// Read script.js template
let scriptContent = fs.readFileSync('js/script.js', 'utf8')

// Inject API key as a global variable
scriptContent = `window.env = { apiKey: "${apiKey}" };\n${scriptContent.replace(
  'const { apiKey } = config;',
  ''
)}`

// Write to a new file
fs.writeFileSync('js/script.built.js', scriptContent, 'utf8')
console.log('Build completed. Use js/script.built.js in index.html')
