window.addEventListener('load', ()=> {
    let lon;
    let lat;

    let descriptionSelector = document.querySelector(".description");
    let temperatureSelector = document.querySelector(".temperature");
    let locationSelector = document.querySelector(".location");
    
    let fiveDayTemps = new Array(5);
    let fiveDayMaxTemps = new Array(5);
    let fiveDayMinTemps = new Array(5);
    let fiveDayWind = new Array(5);
    let weatherCode = new Array(5);

    let fiveDays = document.querySelectorAll(".details > span");
    let description = document.querySelectorAll(".details h4");
    let temp = document.querySelectorAll(".temp");
    let day = document.querySelectorAll(".day");
    let weatherImg = document.querySelectorAll(".weather-img");
    let maxTemp = document.querySelectorAll(".max-temp");
    let minTemp = document.querySelectorAll(".min-temp");
    let humidity = document.querySelectorAll(".humidity");
    let arrow = document.querySelectorAll(".humidity-wind img");
    let wind = document.querySelectorAll(".wind");

    let week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let today = new Date();
    let dayName = today.getDay();


    
    /* Users Location */
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }


    function geoSuccess(position) {
        lon = position.coords.longitude;
        lat = position.coords.latitude;

        const api = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=e0befcd35dd548888966eebc1dd8f0da`;

        fetch(api)
            .then(response => {
                return response.json();
            })
            .then(data => {

                console.log(data);

                /* Today's forecast and location */
                descriptionSelector.textContent = data.data[0].weather.description;
                locationSelector.textContent = data.city_name + ', ' + data.country_code;


                /* Get forecast for the next five days */
                var i;
                for(i=0; i<5; i++) {
                    description[i].textContent = data.data[i].weather.description;
                    fiveDayTemps[i] = data.data[i].temp;
                    fiveDayMaxTemps[i] = data.data[i].max_temp;
                    fiveDayMinTemps[i] = data.data[i].min_temp;
                    humidity[i].textContent = data.data[i].rh + '%';
                    fiveDayWind[i] = data.data[i].wind_spd;
                    weatherCode[i] = data.data[i].weather.code;
                }

                /* Apply info */
                update();


                /* Get current day and four upcoming days */
                i = dayName;
                day.forEach(function(element) {
                    element.textContent = week[i++%7];
                });

                var dd, mm, yyyy, date;

                i = 0;
                fiveDays.forEach(function(element) {
                    date = data.data[i++].datetime;
                    dd = date.substring(8,10);
                    mm = date.substring(5,7);
                    yyyy = date.substring(0,4);
                    element.textContent = dd + '.' + mm + '.' + yyyy;
                });

                /* Apply weather icons */
                applyWeatherImg(weatherCode);
                applyBackground(weatherCode[0]);


                /* Wind direction in degrees */
                var direction;

                i = 0;
                arrow.forEach(function(element) {
                    direction = data.data[i++].wind_dir;
                    element.style.transform = "rotate(" + direction + "deg)";
                    element.setAttribute('alt', direction + ' degrees');
                });
            });
    }


    function geoError(error) {
        switch(error.code) {
            case error.PERMISSION_DENIED:
                alert("User denied the request for Geolocation.");
                break;
            case error.POSITION_UNAVAILABLE:
                alert("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                alert("The request to get user location timed out.");
                break;
            case error.UNKNOWN_ERROR:
                alert("An unknown error occurred.");
                break;
        }
    }


    var dayDetails = document.querySelectorAll(".five-day-forecast ul li")
    var details = document.querySelectorAll(".details");
    let delay = 0;

    dayDetails[0].addEventListener('click', function() {
        if(details[0].classList.contains("show-details")) {
            delay = 300;
            details[0].classList.add("animate-details");
        } else {
            delay = 0;
            details[0].classList.remove("animate-details");
        }

        dayDetails[0].classList.toggle("active-day");
        
        setTimeout(function() {
            details[0].classList.toggle("show-details");
        }, delay);
    });
    dayDetails[1].addEventListener('click', function() {
        if(details[1].classList.contains("show-details")) {
            delay = 300;
            details[1].classList.add("animate-details");
        } else {
            delay = 0;
            details[1].classList.remove("animate-details");
        }

        dayDetails[1].classList.toggle("active-day");
        
        setTimeout(function() {
            details[1].classList.toggle("show-details");
        }, delay);
    });
    dayDetails[2].addEventListener('click', function() {
        if(details[2].classList.contains("show-details")) {
            delay = 300;
            details[2].classList.add("animate-details");
        } else {
            delay = 0;
            details[2].classList.remove("animate-details");
        }

        dayDetails[2].classList.toggle("active-day");
        
        setTimeout(function() {
            details[2].classList.toggle("show-details");
        }, delay);
    });
    dayDetails[3].addEventListener('click', function() {
        if(details[3].classList.contains("show-details")) {
            delay = 300;
            details[3].classList.add("animate-details");
        } else {
            delay = 0;
            details[3].classList.remove("animate-details");
        }

        dayDetails[3].classList.toggle("active-day");
        
        setTimeout(function() {
            details[3].classList.toggle("show-details");
        }, delay);
    });
    dayDetails[4].addEventListener('click', function() {
        if(details[4].classList.contains("show-details")) {
            delay = 300;
            details[4].classList.add("animate-details");
        } else {
            delay = 0;
            details[4].classList.remove("animate-details");
        }

        dayDetails[4].classList.toggle("active-day");
        
        setTimeout(function() {
            details[4].classList.toggle("show-details");
        }, delay);
    });




    function applyWeatherImg(weatherCode) {
        let imgName;
        var i = 0;
        weatherImg.forEach(function (element) {
            switch(weatherCode[i++]) {
                case 500:
                    imgName = "light-rain";
                    break;
                case 800:
                    imgName = "clear-sky";
                    break;
                case 801:
                    imgName = "few-clouds";
                    break;
                case 802:
                    imgName = "scattered-clouds";
                    break;
                case 803:
                    imgName = "broken-clouds";
                    break;
                case 804:
                    imgName = "overcast-clouds";
                    break;
                default:
                    imgName = "unknown";
            }

            element.src = "/static/img/weather-images/" + imgName + ".svg";
        });
    }

    function applyBackground(todaysWeatherCode){
        let backgroundName;
        if (todaysWeatherCode == 500) {
            backgroundName = "rain";
        } else if (todaysWeatherCode == 800) {
            backgroundName = "clear";
        } else {
            backgroundName = "clouds";
        }
        body.style.backgroundImage = "url(/static/img/backgrounds/" + backgroundName + ".svg)";
    }
    

    
    /* Settings dropdown menu */
    let dropdown = document.querySelector(".dropdown");
    let openDropdown = document.getElementById("settings-btn");
    let closeDropdown = document.querySelector(".close-dropdown"); // Background div that tracks when user clicks away from dropdown

    /* When settings button is clicked show/hide dropdown and closeDropdown */
    openDropdown.addEventListener('click', function() {
        dropdown.classList.toggle("show-grid");
        closeDropdown.classList.toggle("show-block");
    });

    /* When user clicks away from dropdown hide both dropdown and closeDropdown */
    closeDropdown.addEventListener('click', function() {
        dropdown.classList.remove("show-grid");
        closeDropdown.classList.remove("show-block");
        applyCloseDropdown();
    });




    /* Change background image */
    let body = document.querySelector("body");
    let changeBackground = document.querySelectorAll("#backgrounds div");

    changeBackground[0].addEventListener('click', function() {
        body.style.backgroundImage = "url('static/img/backgrounds/clear.svg')";
        applyCloseDropdown();
    });
    changeBackground[1].addEventListener('click', function() {
        body.style.backgroundImage = "url('static/img/backgrounds/clouds.svg')";
        applyCloseDropdown();
    });
    changeBackground[2].addEventListener('click', function() {
        body.style.backgroundImage = "url('static/img/backgrounds/rain.svg'))";
        applyCloseDropdown();
    });




    let system = document.querySelector(".active");
    let buttons = document.querySelectorAll("#system > button");

    /* Metric */
    buttons[0].addEventListener('click', function() {
        buttons[0].classList.add('active');
        buttons[1].classList.remove('active');
        selectSystem();
        applyCloseDropdown();
    });
    /* Imperial */
    buttons[1].addEventListener('click', function() {
        buttons[0].classList.remove('active');
        buttons[1].classList.add('active');
        selectSystem();
        applyCloseDropdown();
    });

    /* User select system measurement */
    function selectSystem() { 
        system = document.querySelector(".active");
        update();
    }



    function applyCloseDropdown() {
        dropdown.classList.remove("show-grid");
        closeDropdown.classList.remove("show-block");
    }






    /* Update and apply temps and speed */
    function update() {
        temperatureSelector.textContent = tempSystem(fiveDayTemps[0] , system.id);

        i = 0;
        temp.forEach(function(element) {
            element.textContent = tempSystem(fiveDayTemps[i++], system.id);
        });

        i = 0;
        maxTemp.forEach(function(element) {
            element.textContent = tempSystem(fiveDayMaxTemps[i++], system.id);
        });

        i = 0;
        minTemp.forEach(function(element) {
            element.textContent = tempSystem(fiveDayMinTemps[i++], system.id);
        });

        i = 0;
        wind.forEach(function(element) {
            element.textContent = speedSystem(fiveDayWind[i++], system.id);
        });
    }


    /* Calculate temp system */
    function tempSystem(temp, sc) {
        if (sc == "metric") {
            return Math.round(temp) + "°C";
        } else {
            return Math.round((temp * 9/5) + 32) + "°F";
        }
    }

    function speedSystem(speed, sc) {
        if (sc == "metric") {
            return Math.round(speed * 3.6) + " km/h";
        } else {
            return Math.round((speed * 3.6) / 1.609) + " mph";
        }
    }

    /* let body = document.querySelector("body");

    if (today.getHours() < 6 || today.getHours() > 20) {
        body.style.backgroundImage = "url('img/clear-night.svg')";
        body.style.backgroundColor = "#2A3276";

        dropdown.style.color = "rgb(14, 24, 113)";
        dropdown.style.boxShadow = "0 0 80px rgba(12, 27, 141, 0.6)";
        closeDropdown.style.backgroundColor = "rgba(4, 34, 102, 0.4)";
    } */
});