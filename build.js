const fs = require('fs')
const dotenv = require('dotenv')
const path = require('path')

const env = dotenv.parse(fs.readFileSync(path.resolve(__dirname, '.env')))
const apiKey = env.API_KEY || process.env.API_KEY

if (!apiKey) {
  console.error('Error: API key not found in .env or environment variables.')
  process.exit(1)
}

let scriptContent = fs.readFileSync('js/script.js', 'utf8')
scriptContent = `window.env = { apiKey: "${apiKey}" };\n${scriptContent.replace(
  'const { apiKey } = window.env || {};',
  ''
)}`

fs.writeFileSync('js/script.built.js', scriptContent, 'utf8')
console.log('Build completed. Use js/script.built.js in index.html')
