const gKey = "AIzaSyA8c4QHC43f_e06VHKWB5lNHd3dYxmJjjY";
const NRELKEY = "LomNWWBzpBjdlzoYBWwgYV008enn5lo9d7MeetaJ";
const myForm = document.getElementById("address");

const urlEndpoint = "https://maps.googleapis.com/maps/api/geocode/";
let mAddress = "json?address=";

let addButton = document.querySelector("#addButton");
let removeButton = document.querySelector("#removeButton");
let saveButton = document.querySelector("#save");
let toggleAddEnabled = 1;

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

var samsungPanel = {
  panel_height: 1.644,
  panel_width: 0.992,
  heightOffset: 0.00001825 / 2,
  widthOffset: 0.00000894 / 2,
  watt: 250,
};
//height offset = 0.00001825  width offset = 0.00000894 in degrees
//################################################################

let lat;
let lng;

//Global array counter
let numOfPanels = 0;
//Container for panels
let panelContainer = [];

var mymap = L.map("mapid");

let p_bounds = polyPanelLatLng([0, 0]);
let tempPanel = L.polygon(p_bounds, { color: "red", weight: 1 });
tempPanel.addTo(mymap);

mymap.on("click", function (e) {
  if (toggleAddEnabled) {
    //coord is the center of the panel
    let coord = [e.latlng["lat"], e.latlng["lng"]];
    let bounds2 = panelLatLng(coord);
    let polyBounds = polyPanelLatLng(coord);
    console.log(polyBounds);
    // let tempRectangle = L.rectangle(bounds2, { color: "blue", weight: 1 });
    // tempRectangle.addTo(mymap);
    let tempPoly = L.polygon(polyBounds, { color: "blue", weight: 1 });
    tempPoly.addTo(mymap);
    panelContainer.push([tempPoly, getAzimuth()]);
    //console.log(tempRectangle.getBounds());
    //console.log(tempRectangle.getLatLngs());
    numOfPanels++;
    PVWatts();
  } else {
    let indexToRemove = boundChecking(e.latlng["lat"], e.latlng["lng"]);
    console.log("This is from clicking:   " + indexToRemove);
    if (indexToRemove > -1) {
      mymap.removeLayer(panelContainer[indexToRemove][0]);
      numOfPanels--;
      // mymap.panelContainer.splice(indexToRemove, 1);
    }
  }
});

mymap.addEventListener("mousemove", (e) => {
  //console.log(e.latlng["lat"] + " " + e.latlng["lng"]);
  let coord = [e.latlng["lat"], e.latlng["lng"]];
  let bounds2 = polyPanelLatLng(coord);
  tempPanel.setLatLngs(bounds2);
});

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

function setMyMap(lat, lng) {
  mymap.setView([lat, lng], 20);

  var roads = L.gridLayer
    .googleMutant({
      type: "satellite", // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
    })
    .addTo(mymap);
}

function drawPanel(coord) {
  let panelBounds = panelLatLng(coord);
  L.rectangle(panelBounds, { color: "#ff7800", weight: 1 }).addTo(mymap);
}

//returns the top left and bottom right coordinates of the panel
function panelLatLng(coord) {
  //top left lat + lng -
  top_left = [
    coord[0] + samsungPanel.widthOffset,
    coord[1] - samsungPanel.heightOffset,
  ];
  //bot left lat - lng +
  bot_right = [
    coord[0] - samsungPanel.widthOffset,
    coord[1] + samsungPanel.heightOffset,
  ];
  return [top_left, bot_right];
}

function polyPanelLatLng(coord) {
  panel_angle = document.getElementById("mySlider").value - 90;
  // console.log(panel_angle);
  // console.log("###################################");

  // top left [0], top righ [1], bottom right [2], bottom left [4]
  let temp = panelLatLng(coord);
  let polyCoords = [
    temp[0],
    [temp[0][0], temp[1][1]],
    temp[1],
    [temp[1][0], temp[0][1]],
  ];
  //console.log(polyCoords);
  let rotateTempTL = rotate_point(
    temp[0][0],
    temp[0][1],
    coord[0],
    coord[1],
    panel_angle
  );
  polyCoords[0] = rotateTempTL;
  let rotateTempTR = rotate_point(
    polyCoords[1][0],
    polyCoords[1][1],
    coord[0],
    coord[1],
    panel_angle
  );
  polyCoords[1] = rotateTempTR;
  let rotateTempBR = rotate_point(
    polyCoords[2][0],
    polyCoords[2][1],
    coord[0],
    coord[1],
    panel_angle
  );
  polyCoords[2] = rotateTempBR;
  let rotateTempBL = rotate_point(
    polyCoords[3][0],
    polyCoords[3][1],
    coord[0],
    coord[1],
    panel_angle
  );
  polyCoords[3] = rotateTempBL;
  return polyCoords;
}

function calcSystemCapacity() {
  //Size (kW) = Module Nameplate Size (W) × Number of Modules ÷ 1,000 W/kW
  let sizeKW = (numOfPanels * samsungPanel.watt) / 1000;
  return sizeKW;
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
    })
    .catch((error) => {
      console.error(error);
    });
}

function PVWatts() {
  let numOfAzimuth = new Set();

  for (let i = 0; i < panelContainer.length; i++) {
    numOfAzimuth.add(panelContainer[i][1]);
  }

  let azimuthMap = new Map();

  for (let item of numOfAzimuth) {
    azimuthMap.set(item, 0);
  }

  for (let i = 0; i < panelContainer.length; i++) {
    azimuthMap.set(
      panelContainer[i][1],
      azimuthMap.get(panelContainer[i][1]) + 1
    );
  }

  // console.log(numOfAzimuth);
  // console.log(azimuthMap);

  let annualPowerVal = 0;
  let annualSavingsVal = 0;
  const iterator1 = azimuthMap.keys();

  for (let k = 0; k < azimuthMap.size; k++) {
    //console.log(iterator1.next().value + "#####");
    let currentAzimuth = iterator1.next().value;
    let request = `https://developer.nrel.gov/api/pvwatts/v6.json?api_key=${NRELKEY}&lat=${lat}&lon=${lng}&system_capacity=${
      azimuthMap.get(currentAzimuth) * 0.25
    }&azimuth=${currentAzimuth}&tilt=20&array_type=1&module_type=1&losses=14.08`;

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
        annualPowerVal =
          Number(annualPowerVal) + Number(pvJson.outputs.ac_annual.toFixed(2));
        console.log(annualPowerVal);
        annualSavingsVal += Number(
          (pvJson.outputs.ac_annual * 0.122).toFixed(2)
        );
        if (k == azimuthMap.size - 1) {
          let annualPowerStr =
            "Annual AC system output: " + annualPowerVal + " KWh";
          let annualSavings =
            "Annual electricity cost savings: $" + annualSavingsVal;
          document.getElementById(
            "annual-power-output"
          ).textContent = annualPowerStr;
          document.getElementById(
            "annual-power-cost"
          ).textContent = annualSavings;
          let systemSize = "System Size(KWh): " + numOfPanels * 0.25;
          document.getElementById("system-size").textContent = systemSize;
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
}

function updatePVWOutput(str1, str2, str3) {}

//returns index of panel in the array, -1 if not conatianed in the array
function boundChecking(m_lat, m_lng) {
  for (let i = 0; i < panelContainer.length; i++) {
    if (panelContainer[i][0].getBounds().contains([m_lat, m_lng])) {
      return i;
    }
  }
  return -1;
}

function checkPanelOverlap(m_rectangle) {
  for (let i = 0; i < panelContainer.length - 1; i++) {
    temp = panelContainer[i].getLatLngs();
    m_temp = m_rectangle.getLatLngs();
  }
}

function toggleAddRemove(buttonOn, buttonOff) {
  buttonOn.style.setProperty("background", "dodgerblue");
  buttonOff.style.setProperty("background", "none");
}

addButton.addEventListener("click", function () {
  toggleAddRemove(addButton, removeButton);
  toggleAddEnabled = 1;
});

removeButton.addEventListener("click", function () {
  toggleAddRemove(removeButton, addButton);
  toggleAddEnabled = 0;
});

saveButton.addEventListener("click", function () {
  makeJsonPanel();
});

function updateLiveSlider(slideAmount) {
  let tempAngle = document.getElementById("panelAngle");
  tempAngle.style.transform = `rotate(${slideAmount - 90}deg)`;
}

function updateLiveCompass(slideAmount) {
  //since arrow icon faced east, it was initial rotated -90 deg
  let tempImg = document.getElementById("compassImg");
  tempImg.style.transform = `rotate(${slideAmount - 270}deg)`;
  //console.log(getAzimuth());
}

function getAzimuth() {
  azVal = document.getElementById("myCompas").value;
  if (azVal > 179) {
    return azVal - 180;
  } else {
    return Number(azVal) + 181.0;
  }
}

function rotate_point(pointX, pointY, originX, originY, angle) {
  angle = (angle * Math.PI) / 180.0;

  return [
    Math.cos(angle) * (pointX - originX) -
      Math.sin(angle) * (pointY - originY) +
      originX,
    Math.sin(angle) * (pointX - originX) +
      Math.cos(angle) * (pointY - originY) +
      originY,
  ];
}

function makeJsonPanel() {
  //make dictionary of panel number, panel corners, and azimuth
  panelArr = new Array();
  //console.log(panelContainer[0][0].getLatLngs());
  for (let i = 0; i < panelContainer.length; i++) {
    tempCoords = panelContainer[i][0].getLatLngs();
    tempDict = {
      id: i,
      TL: tempCoords[0][0],
      TR: tempCoords[0][1],
      BR: tempCoords[0][2],
      BL: tempCoords[0][3],
      azimuth: panelContainer[i][1],
    };
    panelArr.push(tempDict);
  }

  let strJson = JSON.stringify(panelArr);
  console.log(strJson);

  axios({
    method: "post",
    url: "",
    data: strJson,
    headers: {
      "X-CSRFToken": csrfToken,
      "Content-Type": "application/json",
    },
  }).then((response) => {
    console.log(response);
  });
}

/*
 samsung panel information https://www.solarelectricsupply.com/samsung-solar-module-247w-250w-255w-mba-series-silver-frame
  1644x992x46mm (64.7x39.1x1.8 inches)

 */
