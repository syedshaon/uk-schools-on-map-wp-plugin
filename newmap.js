let map;
let geocoder;
let infoWindow;
let markers = [];

// Function to fetch addresses via AJAX
async function fetchAddresses() {
  const response = await fetch(ajax_object.ajax_url + "?action=fetch_addresses");
  if (!response.ok) {
    console.error("Failed to fetch addresses");
    return [];
  }
  return await response.json();
}

async function initMap() {
  geocoder = new google.maps.Geocoder();
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 55.9533, lng: -3.1883 }, // Coordinates for Edinburgh, Scotland
    zoom: 10,
    mapId: "DEMO_MAP_ID", // Add your map ID here
  });
  infoWindow = new google.maps.InfoWindow();

  // Import the Advanced Marker library
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  // Fetch addresses from the WordPress backend
  const addresses = await fetchAddresses();
  console.log(addresses);

  document.getElementById("postcode-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const postcode = document.getElementById("postcode").value + ", Scotland";
    geocodePostcode(postcode, addresses);
  });
}

function geocodePostcode(postcode, addresses) {
  geocoder.geocode({ address: postcode }, function (results, status) {
    if (status === "OK") {
      const userLocation = results[0].geometry.location;
      processAddressesInChunks(userLocation, addresses);
    } else {
      console.error("Geocode failed: " + status);
    }
  });
}

function processAddressesInChunks(userLocation, addresses) {
  const addressStrings = addresses.map((item) => item.address);
  const chunkSize = 20; // Adjusted chunk size to ensure the total number of elements is within limits
  let distanceResults = [];

  // Clear previous markers
  clearMarkers();

  const processNextChunk = (index) => {
    if (index >= addressStrings.length) {
      // All chunks processed, now sort and update
      distanceResults.sort((a, b) => a.distance - b.distance);
      const closestIndices = distanceResults.slice(0, 4).map((item) => item.index);
      updateAddressList(closestIndices, addresses);
      if (closestIndices.length > 0) {
        showAddressOnMap(addresses[closestIndices[0]].address, addresses[closestIndices[0]].name);
      } else {
        console.log("No nearby schools found.");
      }
      return;
    }

    const chunk = addressStrings.slice(index, index + chunkSize);
    getDistances(userLocation, chunk, index, addresses, distanceResults, () => processNextChunk(index + chunkSize));
  };

  processNextChunk(0);
}

function getDistances(userLocation, chunk, chunkStartIndex, addresses, distanceResults, callback) {
  const service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix(
    {
      origins: [userLocation],
      destinations: chunk,
      travelMode: "DRIVING",
    },
    function (response, status) {
      if (status === "OK") {
        const distances = response.rows[0].elements.map((item, index) => ({
          distance: item.distance.value,
          index: chunkStartIndex + index,
        }));
        distanceResults.push(...distances);
      } else {
        console.error("DistanceMatrix failed: " + status);
      }
      callback();
    }
  );
}

function updateAddressList(closestIndices, addresses) {
  const addressListDiv = document.getElementById("address-list");
  addressListDiv.innerHTML = "<strong>Institutions:</strong><br>";
  if (closestIndices.length > 0) {
    closestIndices.forEach((index, i) => {
      const addressItem = createAddressItem(index, addresses);
      addressListDiv.appendChild(addressItem);
      // if (closestIndices.length > 1 && i < closestIndices.length - 1) {
      //   const separator = document.createElement("hr");
      //   addressListDiv.appendChild(separator);
      // }
    });
  } else {
    addressListDiv.innerHTML = "<strong>No nearby schools found.</strong><br>";
  }
}

function createAddressItem(index, addresses) {
  const addressItem = document.createElement("div");
  addressItem.style.cursor = "pointer";

  const nameText = document.createElement("p");
  nameText.innerHTML = "<strong>" + addresses[index].name + "</strong>";
  addressItem.appendChild(nameText);

  const addressText = document.createElement("p");
  addressText.innerHTML = "<strong>Address: </strong>" + addresses[index].address.replace(/, /g, "<br>");
  addressItem.appendChild(addressText);

  const directorText = document.createElement("p");
  directorText.innerHTML = "<strong>Director: </strong>" + addresses[index].director;
  addressItem.appendChild(directorText);

  const telephoneText = document.createElement("p");
  telephoneText.innerHTML = "<strong>Phone: </strong>" + addresses[index].telephone;
  addressItem.appendChild(telephoneText);

  const facebookText = document.createElement("p");
  facebookText.innerHTML = "<strong>Facebook: </strong>" + `<a href="${addresses[index].facebook}" target="_blank">${addresses[index].facebook}</a>`;
  addressItem.appendChild(facebookText);

  const websiteText = document.createElement("p");
  websiteText.innerHTML = "<strong>Website: </strong>" + `<a href="${addresses[index].website}" target="_blank">${addresses[index].website}</a>`;
  addressItem.appendChild(websiteText);

  addressItem.addEventListener("click", () => showAddressOnMap(addresses[index].address, addresses[index].name));

  return addressItem;
}

async function showAddressOnMap(address, name) {
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  geocoder.geocode({ address: address }, function (results, status) {
    if (status === "OK") {
      clearMarkers();
      const marker = new AdvancedMarkerElement({
        map: map,
        position: results[0].geometry.location,
        title: name,
      });
      markers.push(marker);
      map.setCenter(marker.position);
      map.setZoom(14);
      infoWindow.setContent('<div style="max-width: 300px;"><strong>' + name + "</strong><br>" + address.replace(/, /g, "<br>") + "</div>");
      infoWindow.open(map, marker);
    } else {
      console.error("Geocode failed: " + status);
    }
  });
}

function clearMarkers() {
  markers.forEach((marker) => (marker.map = null));
  markers = [];
}
