const fetch = require('node-fetch')

exports.handler = async (event, context) => {
  const apiKey = process.env.API_KEY
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API key not configured' }),
    }
  }

  const ip = event.queryStringParameters.ip || ''
  const url = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}${
    ip ? `&ipAddress=${ip}` : ''
  }`

  try {
    const response = await fetch(url)
    const data = await response.json()
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    }
  }
}
