let yourweather = document.querySelector("[data-user-tab]");
let searchweather = document.querySelector("[data-search-tab]");
let grantaccess = document.querySelector("[data-grantaccess]");

let searchinput = document.querySelector("[data-search-city]");
let searchform = document.querySelector("[ data-searchform]");
let grantlocation = document.querySelector(".grant-location-container");
let userinfo = document.querySelector(".user-info-container");
let loadingsection = document.querySelector(".loading");

let currenttab = yourweather;
let apikey = "53f2639703a4f2fa5cd52df2c153c514";
currenttab.classList.add("current-tab"); // current tab ko highlight karne ke liye
getsessionstorage(); // agr value pehle se present h to data show kar do


function switchtab(clicktab) {
  if (currenttab !== clicktab) {
    currenttab.classList.remove("current-tab");
    currenttab = clicktab;
    currenttab.classList.add("current-tab");
  }

  if (!searchform.classList.contains("active")) {
    // kya search form is invisible , then make it is visible
    searchform.classList.add("active");
    grantlocation.classList.remove("active");
    userinfo.classList.remove("active");
  } else {
    // abhi search tab par tha , ab your weather visible karna h
    searchform.classList.remove("active");
    userinfo.classList.remove("active");

    // ab me your weather tab me agya hu, toh current weather display karna padega , so
    // lets check loca l storage first for cordinates if we have saved them...

    getsessionstorage();
  }
}



yourweather.addEventListener("click", () => {
    //pass clicked tab as input paramter
    switchtab(yourweather);
});

searchweather.addEventListener("click", () => {
    //pass clicked tab as input paramter
    switchtab(searchweather);
});

// check if cordinates are already present in session storage
function getsessionstorage() {
  // get the cordinates
  let local = sessionStorage.getItem("user-cordinate");
  if (!local) {
    // cordinates is not present
    grantlocation.classList.add("active");
  } 
  else {
    let cordinates = JSON.parse(local);    // convert the string into json object

    fetchuserweatherinfo(cordinates);

  }
}

async function fetchuserweatherinfo(cordinates) {
  // destructuring
  let { lat, long } = cordinates;
  // invisible grant access container
  grantlocation.classList.remove("active");

  // loader  visible
  loadingsection.classList.add("active");

  try {
    console.log("fetch user info");
    let api =await  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apikey}&units=metric`);
    let data = await api.json();
    // data fetch hogya ha to loading image ko invisible kara do
    loadingsection.classList.remove("active");
    userinfo.classList.add("active");
    renderdata1(data);
  } catch (err) {
    console.log("no data fetch");
  }
}



function renderdata1(weatherinfo) {
    console.log("render data");

  let cityname = document.querySelector("[data-cityName]");
  let countryicon = document.querySelector("[ data-countryicon]");
  let weatherdesc = document.querySelector("[data-weatherdesc]");
  let weathericon = document.querySelector("[data-weathericon ]");
  let temp = document.querySelector("[data-temp]");
  let cloud = document.querySelector("[data-cloudiness]");
  let humidity = document.querySelector("[data-humidity]");
  let wind = document.querySelector("[data-windiness]");
  // fetch values from weather info
  cityname.textContent = weatherinfo?.name;
  countryicon.src = `https://flagcdn.com/16x12/${weatherinfo?.sys?.country.toLowerCase()}.png`;
  weatherdesc.textContent=weatherinfo?.weather?.[0]?.description;

 weathericon.src= `http://openweathermap.org/img/w/${weatherinfo?.weather?.[0]?.icon}.png`;
 temp.textContent=`${weatherinfo?.main?.temp} °C`;
 cloud.textContent=`${weatherinfo?.clouds?.all} %`;
 humidity.textContent=`${weatherinfo?.main?.humidity} %`;
 wind.textContent=`${weatherinfo?.wind?.speed} m/s` ;


}

// get the current location by geolocation api

function getlocation(){
    if(navigator.geolocation)
    navigator.geolocation.getCurrentPosition(showposition);
    else
    console.log("no data is found");
}

function showposition(position)
{
    let usercordinates={
     lat: position.coords.latitude,
    long: position.coords.longitude
    }
// store the current location in session storage
// store in user-cordinates from usercordinates object

console.log(position.coords.latitude);
sessionStorage.setItem("user-cordinate",JSON.stringify(usercordinates));
fetchuserweatherinfo(usercordinates);


}

grantaccess.addEventListener('click',getlocation);





searchform.addEventListener('submit',(e)=>{
    console.log("submit");
    e.preventDefault();
    let cityname=searchinput.value;
    if(cityname==="")
    return;
    else{
    fetchsearchinfo(cityname);
    console.log("fetch data");
    }

})

async function fetchsearchinfo(cityname){
    
    loadingsection.classList.add("active");
    grantlocation.classList.remove("active");
    userinfo.classList.remove("active");


    try{
        console.log("fetching start");
        let searchapi=await  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${apikey}&units=metric`);
        let searchdata=await searchapi.json();
        loadingsection.classList.remove("active");
        console.log(searchdata);
        userinfo.classList.add("active");
        renderdata1(searchdata);


        
    }

    catch(er)
    {

      console.log(" no value is given : ");
    
    }
   
    
}
