const findBtn = document.getElementById('findBtn');
const cityInput = document.getElementById('locationInput');

async function search(cityName) {
    if (cityName === '') return;

    try {
        const result = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=6fce1ca337974ae791b154336252306&q=${cityName}&days=3`);
        const finalResult = await result.json();
        console.log(finalResult);
        display(finalResult.location, finalResult.current);
        nextDays(finalResult.forecast.forecastday.slice(1));
        } catch (error) {
        console.error('Error:', error);
    }
}

findBtn.addEventListener('click', function () {
    const cityName = cityInput.value.trim();
    search(cityName);
});

cityInput.addEventListener('keyup', function () {
    const cityName = cityInput.value.trim();
    search(cityName);
});

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function display(city, current) {
    const currentDate = new Date(current.last_updated.replace(" ", "T"));
    const dayName = days[currentDate.getDay()];
    const monthName = months[currentDate.getMonth()];
    const dayNum = currentDate.getDate();

    const cartona = `
    <div class="col-md-4">
        <div class="card forecast-card text-white">
            <div class="head d-flex justify-content-between text-muted">
                <span>${dayName}</span>
                <span>${dayNum} ${monthName}</span>
            </div>                        
            <div class="body">
                <p class="fs-5">${city.name}</p>
                <h1 class="d-inline">${current.temp_c}&deg;C</h1>
                <img src="https:${current.condition.icon}" alt="Weather Icon">
                <p class="text-info mt-4 iconnn">${current.condition.text}</p>
                <div class="icons d-flex justify-content-around mt-2 text-muted">
                    <div><img src="./img/icon-umberella@2x.png" width="24" alt="humidity"> ${current.humidity}%</div>
                    <div><img src="./img/icon-wind@2x.png" width="24" alt="wind"> ${current.wind_kph}km/h</div>
                    <div><img src="./img/icon-compass@2x.png" width="24" alt="direction"> ${current.wind_dir}</div>
                </div>
            </div>
        </div>
    </div>
    `;

    document.querySelector(".row").innerHTML = cartona;
}

function nextDays(forecastDays) {
    let cards = document.querySelector(".row").innerHTML;

    for (let i = 0; i < forecastDays.length; i++) {
        const day = forecastDays[i];
        const dateObj = new Date(day.date);
        const dayName = days[dateObj.getDay()];

        const card = `
        <div class="col-md-4">
            <div class="card forecast-card text-white">
                <div class="head d-flex justify-content-center text-muted">
                    <span>${dayName}</span>
                </div>
                <div class="body text-center">
                <img src="https:${day.day.condition.icon}" alt="Weather Icon">
                <p class="fs-5 mb-0 p-0">${day.day.avgtemp_c}&deg;C</p>
                <small>${day.day.avgtemp_f}&deg;F</small>
                <p class="text-info mt-5 iconnn">${day.day.condition.text}</p>
                </div>
            </div>
        </div>
        `;

        cards += card;
    }

    document.querySelector(".row").innerHTML = cards;
}

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const city = `${lat},${lon}`;
            search(city);
        },
        () => search('Cairo')
    );
}else{
    search('Cairo');
}
