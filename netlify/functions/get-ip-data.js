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
  console.log('Full API key (for debugging):', apiKey) // Log full key to verify

  const ip = event.queryStringParameters?.ip || ''
  const url = `https://geo.ipify.org/api/v2/country,city?apiKey=${encodeURIComponent(
    apiKey
  )}${ip ? `&ipAddress=${encodeURIComponent(ip)}` : ''}`
  console.log('Constructed URL:', url) // Log the exact URL being fetched

  try {
    const response = await fetch(url, {
      timeout: 10000,
      headers: { 'User-Agent': 'NetlifyFunction/1.0' }, // Add a custom User-Agent
    })
    const responseText = await response.text()
    console.log('Geo.ipify raw response:', responseText)
    if (!response.ok) {
      throw new Error(
        `Geo.ipify API failed: ${response.status} ${response.statusText} - ${responseText}`
      )
    }
    const data = JSON.parse(responseText)
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
      statusCode: error.response?.status || 502,
      body: JSON.stringify({ error: error.message }),
    }
  }
}
