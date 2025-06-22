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
  console.log('Using API key:', apiKey.substring(0, 5) + '...')

  const ip = event.queryStringParameters?.ip || ''
  const url = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}${
    ip ? `&ipAddress=${ip}` : ''
  }`
  console.log('Fetching from:', url)

  try {
    const response = await fetch(url, { timeout: 10000 }) // Add timeout of 10 seconds
    const responseText = await response.text() // Capture raw response
    console.log('Geo.ipify raw response:', responseText)
    if (!response.ok) {
      throw new Error(
        `Geo.ipify API failed: ${response.status} ${response.statusText} - ${responseText}`
      )
    }
    const data = JSON.parse(responseText) // Parse only if status is ok
    if (!data || Object.keys(data).length === 0) {
      throw new Error('Empty or invalid response from Geo.ipify')
    }
    console.log('Geo.ipify parsed response:', JSON.stringify(data))
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (error) {
    console.error('Fetch error:', error.message)
    return {
      statusCode: 502, // Use 502 to match the observed error
      body: JSON.stringify({ error: error.message }),
    }
  }
}
