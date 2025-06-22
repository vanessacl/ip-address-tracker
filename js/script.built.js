window.env = {"API_KEY":"at_1kZ4QKzUIUqpGuiSUsMqW41HN6L9H"};
// Load environment variables (for local development with dotenv)
const apiKey = process.env.API_KEY || (window.env && window.env.API_KEY) || ''
if (!apiKey) {
  console.error(
    'Error: API key is missing. Please set API_KEY in .env file or Netlify environment variables.'
  )
  alert(
    'Configuration error: API key is missing. Check .env or Netlify settings.'
  )
  throw new Error('API key not loaded')
}
const spinner = document.getElementById('spinner')
const ipDisplay = document.getElementById('ip')
const locationDisplay = document.getElementById('location')
const timezoneDisplay = document.getElementById('timezone')
const ispDisplay = document.getElementById('isp')
const searchBtn = document.getElementById('search-btn')
const ipInput = document.getElementById('ip-input')

let map = null
let marker = null

//---------- Utility Functions ----------//
function isValidIP(str) {
  return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
    str
  )
}

function isPrivateIP(ip) {
  return /^(10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|192\.168\.)/.test(ip)
}

function isLikelyDomain(str) {
  return /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(str)
}

function toggleSpinner(show) {
  spinner.classList.toggle('hidden', !show)
}

//---------- Map Handling ----------//
function initMap(lat = 0, lng = 0) {
  try {
    if (!map) {
      map = L.map('map').setView([lat, lng], 13)
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution:
          '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map)
      marker = L.marker([lat, lng]).addTo(map)
      console.log(
        'Map initialized with lat:',
        lat,
        'lng:',
        lng,
        'Marker:',
        marker
      )
    } else {
      map.setView([lat, lng], 13)
      if (marker) {
        marker.setLatLng([lat, lng])
      } else {
        marker = L.marker([lat, lng]).addTo(map)
      }
    }
  } catch (error) {
    console.error('Map initialization error:', error)
  }
}

//---------- Fetch and Update ----------//
async function fetchIPData(input = '') {
  input = String(input || '').trim()
  let query = ''

  // Inline helper: resolve domain to IP using Google's DNS
  async function resolveDomainToIP(domain) {
    try {
      const res = await fetch(
        `https://dns.google/resolve?name=${domain}&type=A`
      )
      const data = await res.json()
      return data.Answer?.[0]?.data || null
    } catch (err) {
      console.error('DNS resolution failed:', err)
      return null
    }
  }

  // Input type handling
  if (input) {
    if (input.includes(':')) {
      alert('IPv6 not supported in this demo. Try IPv4 or a domain.')
      return
    }

    if (isPrivateIP(input)) {
      alert('Private IP addresses like 10.x.x.x cannot be geolocated.')
      return
    }

    if (isValidIP(input)) {
      query = `&ipAddress=${input}`
    } else if (isLikelyDomain(input)) {
      const resolvedIP = await resolveDomainToIP(input)
      if (!resolvedIP || !isValidIP(resolvedIP)) {
        alert('Could not resolve domain to a valid IP.')
        return
      }
      query = `&ipAddress=${resolvedIP}`
      console.log('Resolved IP:', resolvedIP)
    } else {
      alert('Invalid IP or domain format.')
      return
    }
  }

  const url = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}${query}`
  console.log('Fetching from URL:', url)

  toggleSpinner(true)
  try {
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error(
        `API request failed with status ${res.status}: ${res.statusText}`
      )
    }
    const data = await res.json()
    console.log('API Response:', data)

    if (
      !data.location ||
      typeof data.location.lat === 'undefined' ||
      typeof data.location.lng === 'undefined'
    ) {
      alert('Could not resolve location from the response.')
      return
    }

    updateInfo(data)
  } catch (err) {
    alert(`Failed to fetch IP/domain info: ${err.message}`)
    console.error('Fetch error:', err)
  } finally {
    toggleSpinner(false)
  }
}

function updateInfo(data) {
  try {
    const { ip, isp, location } = data
    ipDisplay.textContent = ip || 'N/A'
    locationDisplay.textContent = `${location.city || 'N/A'}, ${
      location.region || ''
    }`
    timezoneDisplay.textContent = `UTC ${location.timezone || 'N/A'}`
    ispDisplay.textContent = isp || 'N/A'

    if (typeof location.lat === 'number' && typeof location.lng === 'number') {
      initMap(location.lat, location.lng)
      if (marker) {
        marker.bindPopup(`Location: ${location.city || 'Unknown'}`).openPopup()
      } else {
        console.warn('Marker is undefined, reinitializing')
        marker = L.marker([location.lat, location.lng]).addTo(map)
        marker.bindPopup(`Location: ${location.city || 'Unknown'}`).openPopup()
      }
    } else {
      console.error('Invalid location coordinates:', location)
    }
  } catch (error) {
    console.error('Update info error:', error)
  }
}

//---------- Event Listeners ----------//
searchBtn.addEventListener('click', () => {
  const input = ipInput.value.trim()
  if (input) {
    fetchIPData(input)
  } else {
    fetchIPData() // Fetch current IP if input is empty
  }
})

ipInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    searchBtn.click()
  }
})

//---------- Initialize map and load user's IP data on start ----------//
window.addEventListener('load', () => {
  initMap()
  fetchIPData()
})
