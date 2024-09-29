let map;
let geocoder;
let infoWindow;
let markers = [];

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

  // Addresses list
  const addresses = [
    {
      name: "Polska Szkoła Sobotnia im. Stanisława Kostki w Aberdeen",
      address: "Albyn School, 17-23 Queen’s Road, AB15 4PB Aberdeen",
      director: "Joanna Schmitz",
      telephone: "7784675058",
    },
    {
      name: "Polska Słoneczna Szkoła Sobotnia w Aberdeen",
      address: "2 Pavilion, Craigshaw Business Park, Craigshaw Road, West Tullos Industrial Estate, AB12 3BE Aberdeen",
      director: "Magdalena Wtorkiewicz",
      telephone: "7867304781",
    },
    {
      name: "Ice Candy School w Aberdeen",
      address: "St Machar Academy, St Machar Drive, AB24 3YZ Aberdeen ",
      director: "Klementyna Borowska",
      telephone: "7936503485",
    },
    {
      name: "Centrum Edukacyjne Bajka Oddział Perth",
      address: "Gowans Terrace, PH1 5XA Perth",
      director: "Marcin Rudzki",
      telephone: "7757774012",
    },
    {
      name: "Centrum Edukacyjne Bajka Oddział w Dundee",
      address: "1 Glenagnes Road, DD2 2AB Dundee",
      director: "Marcin Rudzki",
      telephone: "7757774012",
    },
    {
      name: "Akademia Języka Polskiego im. gen. Stanisława Maczka przy Edukacyjnym Centrum Polonijnym odzial Edynburgh",
      address: "Edinburgh Academy Senior School, 42 Henderson Row, Edinburgh, EH3 5BL",
      director: "Małgorzata Firlit",
      telephone: "7542134315",
    },
    {
      name: "Akademia Języka Polskiego im. gen. Stanisława Maczka przy ECP oddział Dalkieth",
      address: "Newbattle Community Campus, Newbattle Rd, Easthouses, Dalkeith EH22 4SX",
      director: "Małgorzata Firlit",
      telephone: "7542134315",
    },
    {
      name: "Akademia Języka Polskiego im. gen. Stanisława Maczka przy ECP oddział Musselburgh",
      address: "The Fisherrow Centre, South Street, Musselburgh, EH21 6AT",
      director: "Małgorzata Firlit",
      telephone: "7542134315",
    },
    {
      name: "Mały Instytut Języka Polskiego „Poloniusz” przy Polskim Stowarzyszeniu Kulturalno-Edukacyjnym im. Adama Mickiewicza",
      address: "76 Craigmillar Castle Ave, Edinburgh, United Kingdom",
      director: "Magdalena Białęcka",
      telephone: "7927294352",
    },
    {
      name: "Szkoła Koniczynka Peebles",
      address: "Walker’s Haugh, Peebles, EH45 8AU",
      director: "Katarzyna Kościelak",
      telephone: "7704936151",
    },
    {
      name: "Polska Szkoła im. Jana Pawła II pod patronatem Polskiego Centrum Pomocy Rodzinie w Edynburgu",
      address: "19 Smith’s Place, EH6 8NU Edinburgh",
      director: "Ewa Nowak",
      telephone: "7404633415",
    },
    {
      name: "Polska Szkoła im. Fryderyka Chopina przy Centrum Kultury i Edukacji w Edinburgh",
      address: "Leith Community Centre, 12A Newkirkgate, EH6 6AD Edinburgh",
      director: "Lucyna Bielicz-Bishara",
      telephone: "7725471259",
    },
    {
      name: "Polska Szkoła Sobotnia Pod Patronatem Stowarzyszenie Polskich Kombatantów W Edinburgh Filia Stenhouse",
      address: "Carrickvale Community Centre, Saughton Mains Street, EH11 3HH Edinburgh ",
      director: "Magdalena Zabluda",
      telephone: "7918586723",
    },
    {
      name: "Polska Szkoła Sobotnia Pod Patronatem Stowarzyszenie Polskich Kombatantów W Edinburgh Filia Gilmerton",
      address: "Goodtrees Neighbourhood Centre, 5 Moredunvale Place, EH17 7LB Edinburgh ",
      director: "Magdalena Zabluda",
      telephone: "7918586723",
    },
    {
      name: "Szkoła bez Granic im. Niedźwiedzia Wojtka odzial w Edynburgu",
      address: "Edinburg Granton College, 350 West Granton Road, EH5 1QE Edinburgh",
      director: "Joanna Ulatowska",
      telephone: "7526349494",
    },
    {
      name: "Szkoła bez Granic im. Niedźwiedzia Wojtka oddzial Livingston",
      address: "St Margaret's Academy, Howden South Road, EH54 6AT Edinburgh",
      director: "Joanna Ulatowska",
      telephone: "7526349494",
    },
    {
      name: "Polska Szkoła Sobotnia w Fife im. Jana Pawła II",
      address: "Linton Lane Centre, Linton Lane, KY2 6LF Kirkcaldy",
      director: "Danuta Piękoś",
      telephone: "7724544543",
    },
    {
      name: "Polska Szkoła w Glasgow im. gen. Stanisława Sosabowskiego",
      address: "Dalmarnock Primary School, Baltic St, Bridgeton, G40 3BA Glasgow",
      director: "Beata Koryga",
      telephone: "7496212976",
    },
    {
      name: "Polska Szkoła Sobotnia Hawick",
      address: "Hawick High School, Buccleuch Road, TD9 0EG Hawick",
      director: "Justyna Dobrowolska",
      telephone: "7756127607",
    },
    {
      name: "Polska Szkoła Sobotnia im. Św. Jana Pawła II i Emilii Plater w Inverness",
      address: "Wellside Road, Balloch, IV2 7GS Inverness",
      director: "Magda Król",
      telephone: "7841641726",
    },
    {
      name: "Polska Szkoła Sobotnia przy SPK im. Gen. Maczka w Kirkcaldy",
      address: "Bennochy House, Forth Park Drive, KY2 5TA Kirkcaldy",
      director: "Aneta Piekarz",
      telephone: "---",
    },
    {
      name: "Polska Szkoła im. Marii Montessori (Fun Little Education)",
      address: "Beech House Quarrywood Court, EH54 6AX Livingston",
      director: "Paulina Raniszewska",
      telephone: "7729969989",
    },
    {
      name: "Polska Szkoła Sobotnia im. Fryderyka Chopina w Perth",
      address: "North Inch Community Campus,Gowans Terrace, PH1 5BF Perth",
      director: "Wioletta Hass-Lipińska",
      telephone: "7783140888",
    },
    {
      name: "Centrum Edukacyjne Razem",
      address: "Rosyth Community Church, Torridon Lane, KY11 2EU Rosyth ",
      director: "Stanisława Kossak",
      telephone: "7403825479",
    },
    {
      name: "Sikorski Polish School w Glasgow",
      address: "Sikorski Polish Club, 5 Parkgrove Terrace, G37SD Glasgow",
      director: "Aleksandra Kirwiel",
      telephone: "7437662191",
    },
    {
      name: "Szkoła Języka Polskiego i Kultury w Motherwell",
      address: "St. Bernadette’s Primary School, Vickers Street, ML1 3RE Motherwell",
      director: "Agata Lis",
      telephone: "7754711762",
    },
  ];

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
      infoWindow.setContent('<div style="max-width: 200px;"><strong>' + name + "</strong><br>" + address.replace(/, /g, "<br>") + "</div>");
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
