const API_KEY = '30763300f8c4c48425c4f2b79dad61fe';
const defaultCity = 'London';

function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' };
    const date = now.toLocaleDateString('en-US', options);
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('date-time').textContent = `${time} · ${date}`;
}

function changeIcon(condition) {
    const icons = {
        'Clear': 'bi-sun',
        'Clouds': 'bi-cloud',
        'Rain': 'bi-cloud-rain',
        'Drizzle': 'bi-cloud-drizzle',
        'Snow': 'bi-snow',
        'Thunderstorm': 'bi-cloud-lightning-rain',
    };
    const icon = icons[condition] || 'bi-cloud';
    document.getElementById('weather-icon').className = `bi ${icon}`;
}

function changeBackground(condition) {
    const backgrounds = {
        'Clear': './assets/img/sunny.jpg',
        'Clouds': './assets/img/cloudy.jpg',
        'Rain': './assets/img/rain_window.jpg',
        'Drizzle': './assets/img/rain_window.jpg',
        'Snow': './assets/img/snow.jpg',
        'Thunderstorm': './assets/img/thunder.jpg',
    };
    const img = backgrounds[condition] || './assets/img/rain_window.jpg';
    document.getElementById('app').style.backgroundImage = `url('${img}')`;
}

function updateUI(data) {
    document.getElementById('temperature').textContent = Math.round(data.main.temp) + '°';
    document.getElementById('city-name').textContent = data.name;
    document.getElementById('description').textContent = data.weather[0].description;
    document.getElementById('cloudy').textContent = data.clouds.all + '%';
    document.getElementById('humidity').textContent = data.main.humidity + '%';
    document.getElementById('wind').textContent = Math.round(data.wind.speed * 3.6) + 'km/h';
    document.getElementById('rain').textContent = data.rain ? data.rain['1h'] + 'mm' : '0mm';
    changeBackground(data.weather[0].main);
    changeIcon(data.weather[0].main);
}

async function getWeather(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=en`
        );
        const data = await response.json();
        if (data.cod !== 200) {
            alert('Ville introuvable, essaie une autre !');
            return;
        }
        updateUI(data);
    } catch (error) {
        console.error('Erreur API :', error);
    }
}

// Recherche via loupe
document.querySelector('.search-icon').addEventListener('click', () => {
    const city = document.querySelector('.search-input').value.trim();
    if (city) getWeather(city);
});

// Recherche via touche Entrée
document.querySelector('.search-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = e.target.value.trim();
        if (city) getWeather(city);
    }
});

// Clic sur une ville
document.querySelectorAll('.city-item').forEach(item => {
    item.addEventListener('click', () => {
        getWeather(item.textContent);
    });
});

// Chargement initial
getWeather(defaultCity);

// Heure en temps réel
updateDateTime();
setInterval(updateDateTime, 60000);