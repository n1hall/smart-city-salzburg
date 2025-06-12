// Initialize map layers
let bikeLayer, evLayer, recyclingLayer, wifiLayer;
const layers = new Map();

// Initialize map with a better starting position and zoom for Salzburg
const map = L.map('map', {
    center: [47.8095, 13.0550],
    zoom: 13,
    zoomControl: true,
    minZoom: 11,
    maxZoom: 18
});

// Add Breton OpenStreetMap tile layer
var OpenStreetMap_CAT = L.tileLayer('https://tile.openstreetmap.bzh/ca/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles courtesy of <a href="https://www.openstreetmap.cat" target="_blank">Breton OpenStreetMap Team</a>'
}).addTo(map);

// Add zoom control (already present by default, but ensure it's visible)
map.zoomControl.setPosition('bottomright');

// Sidebar popup toggle (show/hide controls)
const controls = document.getElementById('controls');

// Initialize marker cluster group
const markerClusterGroup = L.markerClusterGroup({
    maxClusterRadius: 50,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    iconCreateFunction: function(cluster) {
        const count = cluster.getChildCount();
        return L.divIcon({
            html: `<div class="cluster-icon"><span>${count}</span></div>`,
            className: 'marker-cluster',
            iconSize: L.point(40, 40)
        });
    }
});

// Add cluster group to map
map.addLayer(markerClusterGroup);

// Loading indicator function
function showLoading() {
    const loader = document.createElement('div');
    loader.className = 'loading-overlay';
    loader.textContent = 'Loading data...';
    document.getElementById('map-container').appendChild(loader);
    return loader;
}

// Error handling function
function handleError(error, layerName) {
    console.error(`Error loading ${layerName}:`, error);
    const loader = document.querySelector('.loading-overlay');
    if (loader) {
        loader.textContent = `Error loading ${layerName}. Please try again later.`;
        setTimeout(() => loader.remove(), 3000);
    }
}

// Custom icon definitions using FontAwesome SVGs
const bikeIcon = L.divIcon({
    html: '<i class="fa-solid fa-bicycle"></i>',
    className: 'fa-marker-icon bike',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});
const evIcon = L.divIcon({
    html: '<i class="fa-solid fa-charging-station"></i>',
    className: 'fa-marker-icon ev',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});
const recyclingIcon = L.divIcon({
    html: '<i class="fa-solid fa-recycle"></i>',
    className: 'fa-marker-icon recycling',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});
const wifiIcon = L.divIcon({
    html: '<i class="fa-solid fa-wifi"></i>',
    className: 'fa-marker-icon wifi',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

function createPropertiesTable(properties) {
    let rows = '';
    for (const [key, value] of Object.entries(properties)) {
        if (value !== undefined && value !== null && String(value).trim() !== '') {
            rows += `<tr><td><strong>${key}</strong></td><td>${value}</td></tr>`;
        }
    }
    return rows ? `<table class="popup-table">${rows}</table>` : '';
}

// Load bicycle rental points
async function loadBikeLayer() {
    const loader = showLoading();
    try {
        const response = await fetch('data/Bicycle_rental_features.json');
        const data = await response.json();
        
        bikeLayer = L.geoJSON(data, {
            pointToLayer: (feature, latlng) => {
                return L.marker(latlng, { icon: bikeIcon });
            },
            onEachFeature: (feature, layer) => {
                const popupContent = `
                    <div class="popup-content bike-popup">
                        <h3>Bicycle Rental</h3>
                        ${createPropertiesTable(feature.properties)}
                    </div>`;
                layer.bindPopup(popupContent);
            }
        });
        layers.set('bike', bikeLayer);
        markerClusterGroup.addLayer(bikeLayer);
        return bikeLayer;
    } catch (error) {
        handleError(error, 'bicycle rentals');
        return null;
    } finally {
        loader.remove();
    }
}

// Load charging stations
async function loadEvLayer() {
    const loader = showLoading();
    try {
        const response = await fetch('data/Charging_stations_features.geojson');
        const data = await response.json();
        
        evLayer = L.geoJSON(data, {
            pointToLayer: (feature, latlng) => {
                return L.marker(latlng, { icon: evIcon });
            },
            onEachFeature: (feature, layer) => {
                const popupContent = `
                    <div class="popup-content ev-popup">
                        <h3>Charging Station</h3>
                        ${createPropertiesTable(feature.properties)}
                    </div>`;
                layer.bindPopup(popupContent);
            }
        });
        layers.set('ev', evLayer);
        markerClusterGroup.addLayer(evLayer);
        return evLayer;
    } catch (error) {
        handleError(error, 'charging stations');
        return null;
    } finally {
        loader.remove();
    }
}

// Load recycling points
async function loadRecyclingLayer() {
    const loader = showLoading();
    try {
        const response = await fetch('data/recycling_features.json');
        const data = await response.json();
        
        recyclingLayer = L.geoJSON(data, {
            pointToLayer: (feature, latlng) => {
                return L.marker(latlng, { icon: recyclingIcon });
            },
            onEachFeature: (feature, layer) => {
                const popupContent = `
                    <div class="popup-content recycling-popup">
                        <h3>Recycling Point</h3>
                        ${createPropertiesTable(feature.properties)}
                    </div>`;
                layer.bindPopup(popupContent);
            }
        });
        layers.set('recycling', recyclingLayer);
        markerClusterGroup.addLayer(recyclingLayer);
        return recyclingLayer;
    } catch (error) {
        handleError(error, 'recycling points');
        return null;
    } finally {
        loader.remove();
    }
}

// Load public WiFi points
async function loadWifiLayer() {
    const loader = showLoading();
    try {
        const response = await fetch('data/Public_internet_features.geojson');
        const data = await response.json();
        
        wifiLayer = L.geoJSON(data, {
            pointToLayer: (feature, latlng) => {
                return L.marker(latlng, { icon: wifiIcon });
            },
            onEachFeature: (feature, layer) => {
                const popupContent = `
                    <div class="popup-content wifi-popup">
                        <h3>Public WiFi</h3>
                        ${createPropertiesTable(feature.properties)}
                    </div>`;
                layer.bindPopup(popupContent);
            }
        });
        layers.set('wifi', wifiLayer);
        markerClusterGroup.addLayer(wifiLayer);
        return wifiLayer;
    } catch (error) {
        handleError(error, 'WiFi points');
        return null;
    } finally {
        loader.remove();
    }
}

// --- Search Functionality ---
const searchBox = document.getElementById('search-box');
const searchResults = document.getElementById('search-results');
const searchType = document.getElementById('search-type');
let allFeatures = [];

function collectAllFeatures() {
    allFeatures = [];
    [bikeLayer, evLayer, recyclingLayer, wifiLayer].forEach(layer => {
        if (layer) {
            layer.eachLayer(l => {
                if (l.feature) {
                    allFeatures.push({
                        feature: l.feature,
                        latlng: l.getLatLng(),
                        layerType: layer === bikeLayer ? 'Bicycle Rental' : layer === evLayer ? 'Charging Station' : layer === recyclingLayer ? 'Recycling Point' : 'Public WiFi',
                        leafletLayer: l
                    });
                }
            });
        }
    });
}

function showSearchResults(results) {
    searchResults.innerHTML = '';
    if (results.length === 0) {
        searchResults.style.display = 'none';
        return;
    }
    results.forEach(item => {
        const div = document.createElement('div');
        div.className = 'result-item';
        div.textContent = `${item.feature.properties.name || item.layerType} (${item.layerType})`;
        div.onclick = () => {
            map.setView(item.latlng, 17);
            item.leafletLayer.openPopup();
            searchResults.style.display = 'none';
            searchBox.value = '';
        };
        searchResults.appendChild(div);
    });
    searchResults.style.display = 'block';
}

searchBox.addEventListener('input', function() {
    const query = this.value.trim().toLowerCase();
    const selectedType = searchType.value;
    if (!query) {
        searchResults.style.display = 'none';
        return;
    }
    const results = allFeatures.filter(item => {
        const name = (item.feature.properties.name || '').toLowerCase();
        const type = (item.layerType || '').toLowerCase();
        const matchesType = selectedType === 'all' || item.layerType === selectedType;
        return matchesType && (name.includes(query) || type.includes(query));
    });
    showSearchResults(results);
});

searchType.addEventListener('change', function() {
    // Trigger search again when type changes
    searchBox.dispatchEvent(new Event('input'));
});

// Hide results when clicking outside
searchBox.addEventListener('blur', function() {
    setTimeout(() => { searchResults.style.display = 'none'; }, 200);
});

// Load all layers and fit bounds
Promise.all([
    loadBikeLayer(), 
    loadEvLayer(), 
    loadRecyclingLayer(), 
    loadWifiLayer()
]).then((loadedLayers) => {
    const validLayers = loadedLayers.filter(layer => layer !== null);
    if (validLayers.length > 0) {
        const bounds = L.featureGroup(validLayers).getBounds();
        map.fitBounds(bounds, { padding: [50, 50] });
    }
    collectAllFeatures();
    // Initialize layer toggle buttons only after layers are loaded
    const layerToggleButtons = document.querySelectorAll('.layer-toggle');
    layerToggleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const layerKey = btn.getAttribute('data-layer');
            const layer = layers.get(layerKey);
            if (!layer) return;
            if (map.hasLayer(layer)) {
                map.removeLayer(layer);
                btn.classList.remove('active');
            } else {
                map.addLayer(layer);
                btn.classList.add('active');
            }
        });
    });
}).catch(error => {
    // Show a user-friendly error overlay if data fails to load
    let overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.textContent = 'Error loading map data. Please check your data files and reload the page.';
    document.getElementById('map-container').appendChild(overlay);
    console.error('Error loading layers:', error);
});
