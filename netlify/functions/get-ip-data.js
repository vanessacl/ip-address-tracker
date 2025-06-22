const fetch = require('node-fetch')

exports.handler = async (event, context) => {
  console.log('Function invoked with event:', JSON.stringify(event))
  const apiKey = process.env.API_KEY
  if (!apiKey) {
    console.error('API key not found in environment variables')
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API key not configured' }),
    }
  }
  console.log('Using API key:', apiKey.substring(0, 5) + '...') // Log partial key for debugging

  const ip = event.queryStringParameters?.ip || ''
  const url = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}${
    ip ? `&ipAddress=${ip}` : ''
  }`
  console.log('Fetching from:', url)

  try {
    const response = await fetch(url)
    if (!response.ok)
      throw new Error(
        `Geo.ipify API failed: ${response.status} ${response.statusText}`
      )
    const data = await response.json()
    console.log('Geo.ipify response:', JSON.stringify(data))
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (error) {
    console.error('Fetch error:', error.message)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    }
  }
}
