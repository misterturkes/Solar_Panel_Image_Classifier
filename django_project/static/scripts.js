const gKey = "AIzaSyA8c4QHC43f_e06VHKWB5lNHd3dYxmJjjY";
const NRELKEY = "LomNWWBzpBjdlzoYBWwgYV008enn5lo9d7MeetaJ";
const myForm = document.getElementById("address");

const urlEndpoint = "https://maps.googleapis.com/maps/api/geocode/";
const urlEndpoint2 =
  "https://maps.googleapis.com/maps/api/elevation/json?locations=";
const urlEndpointStatic = "https://maps.googleapis.com/maps/api/staticmap?";
let mAddress = "json?address=";

let tempLat = 0;
let tempLng = 0;

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
const csrfToken = getCookie("csrftoken");

console.log("This is the csrftoken " + csrfToken);

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
  tempLat = mlat;
  tempLng = mlng;

  //let urlParams = encodeURI(mAddress).replaceAll("%20", "+");
  var urlParams = mlat + "," + mlng + "&key=" + gKey;

  const request2 = new Request(urlEndpoint2 + urlParams);

  getElevation(request2);
  //getElevation(
  // "https://maps.googleapis.com/maps/api/elevation/json?locations=39.7391536,-104.9847034&key=AIzaSyA8c4QHC43f_e06VHKWB5lNHd3dYxmJjjY"
  //);
});

function download() {
  //https://maps.googleapis.com/maps/api/staticmap?center=lat,lng&zoom=20&size=500x500&key=API_Key
  let stat =
    urlEndpointStatic +
    "center=" +
    mymap.getCenter().lat +
    "," +
    mymap.getCenter().lng +
    "&maptype=satellite&zoom=20&size=500x500&format=png&key=" +
    gKey;
  return stat;
}
/* utilizes the same axios package from takeShot() to generate the .png static image of current
map view. POST's that image to the html document as a hidden element. This calls the views.py
as it has a POST listener that then takes the "upload_image" hidden element and runs it through the 
imageClassifier.py and posts that output back to "true-bar" and "false-bar"
*/

function analyzeCurrent() {
  //sendImg(response.data);
  axios({
    url: download(),
    method: "GET",
    responseType: "blob",
  }).then((response) => {
    let formdata = new FormData();
    let file = new Blob([response.data]);
    formdata.append("image", file);
    formdata.append("name", "screenshot");
    formdata.append("lat", tempLat);
    formdata.append("lng", tempLng);
    console.log(formdata);
    axios({
      method: "post",
      url: "upload_image",
      data: formdata,
      headers: {
        "X-CSRFToken": csrfToken,
        "Content-Type": "multipart/form-data",
      },
    }).then((response) => {
      console.log(typeof response.data);
      const parser = new DOMParser();
      const virtualDoc = parser.parseFromString(response.data, "text/html");
      //console.log(virtualDoc.getElementById("true-bar").value)
      document.getElementById("true-bar").value = virtualDoc.getElementById(
        "true-bar"
      ).value;
      document.getElementById("false-bar").value = virtualDoc.getElementById(
        "false-bar"
      ).value;
    });
  });
}
/* called by the Download ScreenShot button. Creates axios object that generates a blob 
element of the static link .png image based on current map view's latitude and longitude.
It is then put into the main html document as element 'a' which then creates a hypertext link
that simulates the user clicking on it causing the download.
*/
function takeshot() {
  axios({
    url: download(),
    method: "GET",
    responseType: "blob",
  }).then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    //console.log(response.data)
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "shot.png");
    document.body.appendChild(link);
    link.click();
  });
}
/* pulls from uploaded image file
 */
function runAnalyze() {
  axios({
    url: download(),
    method: "GET",
    responseType: "blob",
  }).then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "shot.png");
    document.body.appendChild(link);
    getElementById("image-upload").value = link.click();
  });
}

function sendImg(m_img) {
  // Send a POST request
  console.log(m_img);
  axios({
    method: "post",
    name: "axios_post",
    url: "/upload_image",
    data: {
      solar: 0.8,
      roof: 0.2,
      blob: m_img,
    },
    headers: { "X-CSRFToken": csrfToken },
  });
}

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
