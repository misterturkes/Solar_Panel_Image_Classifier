const gKey = "AIzaSyA8c4QHC43f_e06VHKWB5lNHd3dYxmJjjY";
const NRELKEY = "LomNWWBzpBjdlzoYBWwgYV008enn5lo9d7MeetaJ";
const myForm = document.getElementById("address");

const urlEndpoint = "https://maps.googleapis.com/maps/api/geocode/";
const urlEndpoint2 =
  "https://maps.googleapis.com/maps/api/elevation/json?locations=";
let mAddress = "json?address=";

var mymap = L.map("mapid");

myForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let mJson;

  let data = new FormData(myForm);
  for (pair of data.entries()) {
    mAddress += pair[1];
  }
  let urlParams = encodeURI(mAddress).replaceAll("%20", "+");
  urlParams += `&key=${gKey}`;

  const request = new Request(urlEndpoint + urlParams);

  gMapsLatLng(request);
});

mymap.addEventListener("click", (e) => {
  let mlat = e.latlng.lat;
  let mlng = e.latlng.lng;

  //let urlParams = encodeURI(mAddress).replaceAll("%20", "+");
  let urlParams = `${mlat},${mlng}&key=${gKey}`;

  const request2 = new Request(urlEndpoint2 + urlParams);

  //getElevation(request2);
  getElevation(
    "https://maps.googleapis.com/maps/api/elevation/json?locations=39.7391536,-104.9847034&key=AIzaSyA8c4QHC43f_e06VHKWB5lNHd3dYxmJjjY"
  );
});

function setMyMap(lat, lng) {
  mymap.setView([lat, lng], 20);

  var roads = L.gridLayer
    .googleMutant({
      type: "satellite", // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
    })
    .addTo(mymap);
}

//https://maps.googleapis.com/maps/api/elevation/json?locations=39.7391536,-104.9847034|36.455556,-116.866667&key=YOUR_API_KEY
function getElevation(request2) {
  fetch(request2)
    .then((response) => {
      if (response.status === 200) {
        //console.log("success");
        return response.json();
      } else {
        throw new Error("Something went wrong on api server!");
      }
    })
    .then((response) => {
      //console.log(response);
      mJson = response;
      console.log(mJson);
    })
    .catch((error) => {
      console.error(error);
    });
}

function gMapsLatLng(request) {
  fetch(request)
    .then((response) => {
      if (response.status === 200) {
        //console.log("success");
        return response.json();
      } else {
        throw new Error("Something went wrong on api server!");
      }
    })
    .then((response) => {
      //console.log(response);
      mJson = response;
      lat = mJson["results"][0]["geometry"]["location"]["lat"];
      lng = mJson["results"][0]["geometry"]["location"]["lng"];
      console.log(lat + "  " + lng);
      setMyMap(lat, lng);
      PVWatts(lat, lng);
    })
    .catch((error) => {
      console.error(error);
    });
}

function PVWatts(lat, lng) {
  let request = `https://developer.nrel.gov/api/pvwatts/v6.json?api_key=${NRELKEY}&lat=${lat}&lon=${lng}&system_capacity=${2}&azimuth=180&tilt=20&array_type=1&module_type=1&losses=14.08`;

  let mJson;
  fetch(request)
    .then((response) => {
      if (response.status === 200) {
        //console.log("success");
        return response.json();
      } else {
        throw new Error("Something went wrong on api server!");
      }
    })
    .then((response) => {
      pvJson = response;
      console.log("PVWatts response for a 2kwh system");
      console.log(pvJson);
    })
    .catch((error) => {
      console.error(error);
    });
}
