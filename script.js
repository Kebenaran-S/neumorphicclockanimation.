const maxDigits = [2, 9, 5, 9, 5, 9]; 
const strips = document.querySelectorAll('.strip');
const dateDisplay = document.getElementById('dateDisplay');

strips.forEach((strip, index) => {
    for (let i = 0; i <= maxDigits[index]; i++) {
        const numDiv = document.createElement('div');
        numDiv.classList.add('number');
        numDiv.innerText = i;
        strip.appendChild(numDiv);
    }
});

function updateTime() {
    const now = new Date();
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateDisplay.innerText = now.toLocaleDateString('id-ID', options);

    const timeString = 
        String(now.getHours()).padStart(2, '0') +
        String(now.getMinutes()).padStart(2, '0') +
        String(now.getSeconds()).padStart(2, '0');

    strips.forEach((strip, index) => {
        const digit = parseInt(timeString[index]);
        
        strip.style.setProperty('--digit', digit);

        const numbers = strip.querySelectorAll('.number');
        numbers.forEach(num => num.classList.remove('pop'));
        
        if(numbers[digit]) {
            numbers[digit].classList.add('pop');
        }
    });
}

setInterval(updateTime, 1000);
updateTime();

const lat = -7.7956;
const lon = 110.3695;

async function fetchWeather() {
    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const data = await response.json();
        
        if (data && data.current_weather) {
            const temp = Math.round(data.current_weather.temperature);
            const weatherCode = data.current_weather.weathercode;
            const isDay = data.current_weather.is_day;
            
            let icon = '☁️';
            let bgImg = '4.png'; 

            if (weatherCode === 0 || weatherCode === 1) {
                icon = isDay ? '☀️' : '🌙'; 
                bgImg = isDay ? '1.png' : '2.png'; 
            } else if (weatherCode >= 2 && weatherCode <= 3) {
                icon = '☁️'; 
                bgImg = isDay ? '4.png' : '2.png'; 
            } else if (weatherCode >= 51 && weatherCode <= 67) {
                icon = '🌧️'; 
                bgImg = '3.png'; 
            } else if (weatherCode >= 95) {
                icon = '⛈️'; 
                bgImg = '3.png'; 
            }

            document.getElementById('weatherDisplay').innerHTML = `${icon} ${temp}°C`;
            document.getElementById('bgImage').style.backgroundImage = `url('${bgImg}')`;
        }
    } catch (error) {
        console.error("Gagal mengambil data cuaca:", error);
        document.getElementById('weatherDisplay').innerText = "☀️ --°C";
        document.getElementById('bgImage').style.backgroundImage = "url('1.png')";
    }
}

fetchWeather();
setInterval(fetchWeather, 15 * 60 * 1000);