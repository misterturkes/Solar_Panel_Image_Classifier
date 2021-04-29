const gKey = "AIzaSyA8c4QHC43f_e06VHKWB5lNHd3dYxmJjjY";
const NRELKEY = "LomNWWBzpBjdlzoYBWwgYV008enn5lo9d7MeetaJ";
const myForm = document.getElementById("address");

const urlEndpoint = "https://maps.googleapis.com/maps/api/geocode/";
let mAddress = "json?address=";

let addButton = document.querySelector("#addButton");
let removeButton = document.querySelector("#removeButton");
let toggleAddEnabled = 1;

var samsungPanel = {
  panel_height: 1.644,
  panel_width: 0.992,
  heightOffset: 0.00001825 / 2,
  widthOffset: 0.00000894 / 2,
  watt: 250,
};
//height offset = 0.00001825  width offset = 0.00000894 in degrees

let lat;
let lng;

//Global array counter
let numOfPanels = 0;
//Container for panels
let panelContainer = [];

var mymap = L.map("mapid");

let bounds = panelLatLng([0, 0]);
let tempPanel = L.rectangle(bounds, { color: "red", weight: 1 });
tempPanel.addTo(mymap);

mymap.on("click", function (e) {
  if (toggleAddEnabled) {
    //coord is the center of the panel
    let coord = [e.latlng["lat"], e.latlng["lng"]];
    let bounds2 = panelLatLng(coord);
    let tempRectangle = L.rectangle(bounds2, { color: "blue", weight: 1 });
    tempRectangle.addTo(mymap);
    panelContainer.push(tempRectangle);
    //console.log(tempRectangle.getBounds());
    //console.log(tempRectangle.getLatLngs());
    numOfPanels++;
    PVWatts();
  } else {
    let indexToRemove = boundChecking(e.latlng["lat"], e.latlng["lng"]);
    console.log("This is from clicking:   " + indexToRemove);
    if (indexToRemove > -1) {
      mymap.removeLayer(panelContainer[indexToRemove]);
      panelContainer.splice(indexToRemove, 1);
    }
  }
});

mymap.addEventListener("mousemove", (e) => {
  console.log(e.latlng["lat"] + " " + e.latlng["lng"]);
  let coord = [e.latlng["lat"], e.latlng["lng"]];
  let bounds2 = panelLatLng(coord);
  tempPanel.setBounds(bounds2);
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
  let request = `https://developer.nrel.gov/api/pvwatts/v6.json?api_key=${NRELKEY}&lat=${lat}&lon=${lng}&system_capacity=${calcSystemCapacity()}&azimuth=180&tilt=20&array_type=1&module_type=1&losses=14.08`;

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
      let annualPowerStr =
        "Annual AC system output: " +
        pvJson.outputs.ac_annual.toFixed(2) +
        " KWh";
      let annualSavings =
        "Annual electricity cost savings: $" +
        (pvJson.outputs.ac_annual * 0.122).toFixed(2);
      document.getElementById(
        "annual-power-output"
      ).textContent = annualPowerStr;
      document.getElementById("annual-power-cost").textContent = annualSavings;
    })
    .catch((error) => {
      console.error(error);
    });
}
//returns index of panel in the array, -1 if not conatianed in the array
function boundChecking(m_lat, m_lng) {
  for (let i = 0; i < panelContainer.length; i++) {
    if (
      m_lat <= panelContainer[i]._bounds._northEast.lat &&
      m_lat >= panelContainer[i]._bounds._southWest.lat
    ) {
      if (
        m_lng <= panelContainer[i]._bounds._northEast.lng &&
        m_lng >= panelContainer[i]._bounds._southWest.lng
      ) {
        return i;
      }
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
  buttonOn.style.setProperty("border-color", "dodgerblue");
  buttonOff.style.setProperty("background", "grey");
  buttonOff.style.setProperty("border-color", "grey");
}

addButton.addEventListener("click", function () {
  toggleAddRemove(addButton, removeButton);
  toggleAddEnabled = 1;

  console.log("we be adding");
});

removeButton.addEventListener("click", function () {
  toggleAddRemove(removeButton, addButton);
  toggleAddEnabled = 0;
  console.log("we be removing");
});
/*
 samsung panel information https://www.solarelectricsupply.com/samsung-solar-module-247w-250w-255w-mba-series-silver-frame
  1644x992x46mm (64.7x39.1x1.8 inches)

 */
