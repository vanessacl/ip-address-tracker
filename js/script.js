const apiKey = 'at_1kZ4QKzUIUqpGuiSUsMqW41HN6L9H'
const spinner = document.getElementById('spinner')

const ipDisplay = document.getElementById('ip')
const locationDisplay = document.getElementById('location')
const timezoneDisplay = document.getElementById('timezone')
const ispDisplay = document.getElementById('isp')
const searchBtn = document.getElementById('search-btn')
const ipInput = document.getElementById('ip-input')

let map, marker

//---------- Utility Functions ----------//
function isValidIP(str) {
  return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(\1\.){2}\1$/.test(str)
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
  if (map) {
    map.setView([lat, lng], 13)
    marker.setLatLng([lat, lng])
  } else {
    map = L.map('map').setView([lat, lng], 13)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map)
    var marker = L.marker([lat, lng]).addTo(map) //add marker to map
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
    } else {
      const resolvedIP = await resolveDomainToIP(input)
      if (!resolvedIP || !isValidIP(resolvedIP)) {
        alert('Could not resolve domain to a valid IP.')
        return
      }
      query = `&ipAddress=${resolvedIP}`
      console.log('Resolved Ip:', resolvedIP)
    }
  }

  const url = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}${query}`

  toggleSpinner(true)
  try {
    const res = await fetch(url)
    const data = await res.json()

    if (!data.location || typeof data.location.lat === 'undefined') {
      alert('Could not resolve location from the response.')
      return
    }

    updateInfo(data)
  } catch (err) {
    alert('Failed to fetch IP/domain info.')
    console.error(err)
  } finally {
    toggleSpinner(false)
  }
}

function updateInfo(data) {
  const { ip, isp, location } = data
  ipDisplay.textContent = ip || 'N/A'
  locationDisplay.textContent = `${location.city || 'N/A'}, ${
    location.region || ''
  }`
  timezoneDisplay.textContent = `UTC ${location.timezone || ''}`
  ispDisplay.textContent = isp || 'N/A'

  initMap(location.lat, location.lng)
}

//---------- Event Listeners ----------//
searchBtn.addEventListener('click', () => {
  const input = ipInput.value.trim()
  if (input) {
    fetchIPData(input)
  }
})

ipInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    searchBtn.click()
  }
})

//---------- Load user's IP data on start ----------//
fetchIPData()
