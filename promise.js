// wind speed 
// humidity
// feels like
// pressure

//  const API_KEY = "7888a28e5967ee5739fc433dac55b797";
// const city = "Lahore";

// fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)

window.addEventListener("load", () => {
    localStorage.removeItem("cities")
})

const API_KEY = "7888a28e5967ee5739fc433dac55b797";
let search = document.getElementById("search")
let name = document.querySelector(".name")
let error = document.querySelector(".error")
let temp = document.querySelector(".city_weather")
let disc = document.querySelector(".dispcription")
let img = document.querySelector(".weather_img")
let date = document.querySelector(".date")
let div = document.querySelector(".show_result")
let load = document.querySelector(".load")
let span = document.getElementsByTagName("span")
let show_other = document.querySelector(".show_other")
let fore_cast = document.querySelector(".forecast")
let loc = document.querySelector(".location")
let btn = document.querySelector(".search_btn")
let sug = document.querySelector(".suggestion")

let images = {
    "wind": "💨",
    "humidity": "💧",
    "pressure": "🔽",
    "feels_like": "🌡️"
}
let days = ["Monday", "Tuesday", "Wednesday", "Thurday", "Friday", "Saturday", "Sunday"]
let months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"]

loc.addEventListener("click", () => {
    error.classList.add("error")
    // error.classList.remove("error")
    getcurrentlocation()
})

btn.addEventListener("click", (e) => {
    let city_name = search.value.trim()

    if (city_name !== "") {
        error.classList.remove("active_anim")
        error.innerText = ""
        load.classList.add("loader")
        searchweather(city_name)
        empty()
    }
    else {
        error.classList.remove("active_anim")
        error.color = "red"
        generror("Enter any city")
        empty()
    }


})

search.addEventListener("keydown", (e) => {
    let city_name = search.value.trim()

    if (e.key == "Enter") {
        if (city_name !== "") {
            error.classList.remove("active_anim")
            error.innerText = ""
            // span.innerText = "Taking your request"
            load.classList.add("loader")
            searchweather(city_name)
            empty()
        }
        else {
            error.classList.remove("active_anim")
            load.classList.remove("loader")
            empty()
            generror("Enter any city")
        }
    }

})

search.addEventListener("input", () => {
    let suggestion = JSON.parse(localStorage.getItem("cities")) || []
    sug.innerHTML = ""
    let value = search.value.toLowerCase()
    if (value === "")
        return

    let filtered = suggestion.filter(city =>
        city.toLowerCase().includes(value)
    );

    let uniquevalues = [... new Set(filtered)]

    console.log(uniquevalues)
    uniquevalues.forEach((suggest, index) => {
        let li = document.createElement("li")
        li.innerText += suggest
        li.addEventListener("click", () => {
            search.value = suggest;
            search.focus()
            sug.innerHTML = ""
        })
        sug.append(li)

    });
})


async function searchweather(city) {

    if (!navigator.onLine) {
        error.classList.remove("active_anim")
        load.classList.remove("loader")
        generror("Network issue")
        return
    }
    try {
        let data = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
        c = await data.json()
        console.log(c)

        storelocaly(c.name)
        showresult(c)
    }
    catch{
        generror("Not a valid name")
        span.innerText = "Taking your request"
        load.classList.remove("loader")
        empty()
        return
    }
}

function showresult(city) {

    name.innerText = `${city.name}`
    temp.innerText = `${Math.floor(city.main.temp)}°C`
    disc.innerText = `${city.weather[0].description}`
    img.src = `https://openweathermap.org/img/wn/${city.weather[0].icon}@2x.png`
    date.innerText = `${days[caldate().Day - 1]}, ${months[caldate().Month]} ${caldate().Date}, ${caldate().Year} at ${caldate().hours}:${caldate().Minute} ${caldate().dn}`
    show_other.innerHTML = `
      <div class="card">
        <div class="icon">${images.wind}</div>
        <div class="title">Wind Speed</div>
        <div class="main_info">${city.wind.speed} m/s</div>
      </div>
       
       <div class="card">
        <div class="icon">${images.humidity}</div>
        <div class="title">Humidity</div>
        <div class="main_info">${city.main.humidity} %</div>
      </div>
      
       <div class="card">
        <div class="icon">${images.feels_like}</div>
        <div class="title">Feels like</div>
        <div class="main_info">${Math.round(city.main.feels_like)} °C </div>
      </div>
      
       <div class="card">
        <div class="icon">${images.pressure}</div>
        <div class="title">Pressure</div>
        <div class="main_info">${city.main.pressure} hPa</div>
      </div>
      `

    load.classList.remove("loader")
    div.classList.add("active")
    forecast(city.name, API_KEY)

}

function empty() {
    console.log("empty")
    name.innerText = " "
    temp.innerText = " "
    disc.innerText = " "
    img.src = ""
    date.innerText = ""
    fore_cast.innerHTML = ""
    show_other.innerHTML = ""
    div.classList.remove("active");
}

function caldate() {
    let d = new Date()
    let hours = d.getHours()
    let dn = ""
    // hours = (hours % 12) >= 12?"AM":"PM"
    if (hours >= 0 && hours < 12) {
        dn = "PM"
    } else {
        dn = "AM"
    }

    hours = (hours % 12 == 0) ? 12 : hours % 12
    console.log("caldate")
    return {
        "hours": hours,
        "Day": d.getUTCDay(),
        "Month": d.getMonth(),
        "Year": d.getFullYear(),
        "Date": d.getUTCDate(),
        "Minute": d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes(),
        "dn": dn
    }
}

async function forecast(city) {
    let data = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`)
    let cast = await data.json()
    console.log(cast)
    if (data.ok) {
        let day = caldate().Day - 1
        let fore = cast.list.filter(item =>
            item.dt_txt.includes("12:00:00")
        )
        // console.log(daily)
        fore_cast.innerHTML = ""
        fore.forEach(data => {
            if (day > 6) {
                day = 0
            }
            fore_cast.innerHTML += `
        <div class="fore_card">
        <div class="fore_day">${days[day]}</div>
        <img src="${`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}" alt="">
        <div class="fore_temp">${Math.round(data.main.temp)} °C</div>
        <div class="fore_disc">${data.weather[0].description}</div>
      </div>`
            day++
        });
    }

}

function generror(err) {
    error.innerText = err
    error.classList.add("active_anim")
}

function getcurrentlocation() {
    navigator.geolocation.getCurrentPosition(async (position) => {
        try {
            let lat = position.coords.latitude
            let lon = position.coords.longitude
            load.classList.add("loader")
            await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
                .then((loc) => loc.json())
                .then(
                    (loc) => {
                        showresult(loc)
                        // error.classList.remove("active_anim")
                        search.value = loc.name

                    }
                )

        }catch (err) {
            generror(err)
            load.classList.remove("loader")
        }
    })
}



function storelocaly(city) {

    let cities = JSON.parse(localStorage.getItem("cities")) || [];
    cities = [city, ...cities.filter(c => c !== city)].slice(0, 10)
    console.log(cities);
    localStorage.setItem("cities", JSON.stringify(cities));
}

// function storelocaly(city) {
//     let cities = JSON.parse(localStorage.getItem("cities")) || [];
//     cities = [city, ...cities.filter(c => c !== city)].slice(0, 10);
//     localStorage.setItem("cities", JSON.stringify(cities));
// }

// let api = "7888a28e5967ee5739fc433dac55b797"
// forecast("lahore",api)
// localStorage.removeItem("cities")