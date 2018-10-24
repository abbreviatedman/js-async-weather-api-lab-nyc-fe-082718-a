const API_KEY = "2160d09f789779bb4066ad717208144a"


// humidity is at: json.main.humidity

// temps are in KELVIN FOR SOME REASON


/*


******  Basic fetch request for weather *****

fetch(`https://api.openweathermap.org/data/2.5/weather?q=New York&APPID=2160d09f789779bb4066ad717208144a`)
  .then(response => response.json())
  .then(json => lookAtJson(json))



*/

// document.addEventListener('DOMContentLoaded', () => {
//   document.querySelector('.submit-button').addEventListener('click', handleFormSubmit)
// })

// function handleFormSubmit(event) {
//   event.preventDefault()
  
//   const city = document.querySelector('.city').value
  
//   fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${API_KEY}`)
//   .then(response => response.json())
//   .then(json => console.log(json))
// }




const cleanCityInput = (city) => city.split(' ').join('+')

const convertKelvinToFahrenheit = (tempInKelvin) => ((tempInKelvin - 273.15) * 9 / 5 + 32)

const getParagraphWithRoundedTemp = (number) => {
  const paragraph = document.createElement('p')
  paragraph.innerText = `${number.toFixed(0)} deg.`
  return paragraph
}

const getParagraphWithPercentage = (number) => {
  const paragraph = document.createElement('p')
  paragraph.innerText = `${number.toFixed(0)}%`
  return paragraph
}

const getParagraphWithText = (text) => {
  const paragraph = document.createElement('p')
  paragraph.innerText = text
  return paragraph
}

const handleFormSubmit = (event) => {
  event.preventDefault()
  
  const cityInput = document.querySelector('.city').value
  
  const city = cleanCityInput(cityInput)
  
  fetchCurrentWeather(city)
    .then((response) => response.json())
    .then((json) => displayCurrentWeather(json))
    
  fetchFiveDayForecast(city)
    .then((response) => response.json())
    .then((json) => createChart(json))
}

function fetchCurrentWeather(city) {
  const baseUrl = 'http://api.openweathermap.org/data/2.5/weather?'
  const url = `${baseUrl}q=${city}&APPID=${API_KEY}`
  
  return fetch(url)
}

function displayCurrentWeather(json) {
  const tempInKelvin = json.main.temp
  const highTempInKelvin = json.main.temp_max
  const lowTempInKelvin = json.main.temp_min
  const humidity = json.main.humidity
  const cloudCover = json.weather[0].main
  
  const temp = convertKelvinToFahrenheit(tempInKelvin)
  const highTemp = convertKelvinToFahrenheit(highTempInKelvin)
  const lowTemp = convertKelvinToFahrenheit(lowTempInKelvin)
  
  const tempParagraph = getParagraphWithRoundedTemp(temp)
  const lowTempParagraph = getParagraphWithRoundedTemp(lowTemp)
  const highTempParagraph = getParagraphWithRoundedTemp(highTemp)
  const humidityParagraph = getParagraphWithPercentage(humidity)
  const cloudCoverParagraph = getParagraphWithText(cloudCover)
  
  document.querySelector('#temp').appendChild(tempParagraph)
  document.querySelector('#low').appendChild(lowTempParagraph)
  document.querySelector('#high').appendChild(highTempParagraph)
  document.querySelector('#humidity').appendChild(humidityParagraph)
  document.querySelector('#cloudCover').appendChild(cloudCoverParagraph)
}


function fetchFiveDayForecast(city) {
  const baseUrl = 'http://api.openweathermap.org/data/2.5/forecast?'
  const url = `${baseUrl}q=${city}&APPID=${API_KEY}`
  
  return fetch(url)
}

function displayFiveDayForecast(json) {
  json.list.forEach((timePeriod) => displayTimePeriod(timePeriod))
}

function displayTimePeriod(timePeriod) {
  const tempInKelvin = timePeriod.main.temp
  const date = timePeriod.dt_txt
  const humidity = timePeriod.main.humidity
  
  const temp = convertKelvinToFahrenheit(tempInKelvin)
  
  const tempParagraph = getParagraphWithRoundedTemp(temp)
  const humidityParagraph = getParagraphWithPercentage(humidity)
  const dateParagraph = getParagraphWithText(date)
  
  const div = document.createElement('div')
  div.appendChild(tempParagraph)
  div.appendChild(humidityParagraph)
  div.appendChild(dateParagraph)
  document.querySelector('aside').appendChild(div)
}

function createChart(json) {
  console.log(json)
  const ctx = document.querySelector("#WeatherChart");
  const tempsInKelvin = json.list.map((timePeriod) => timePeriod.main.temp)
  const temps = tempsInKelvin.map((temp) => convertKelvinToFahrenheit(temp))
  const labels = json.list.map((timePeriod) => timePeriod.dt_txt)
  const tempChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        data: temps,
        label: json.city.name,
        borderColor: 'red',
        fill: false
      }],
      options: {
        title: {
          display: true,
          text: 'Five Day Forecast'
        }
      }
    }
  })
}

document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('.submit-button').addEventListener('click', handleFormSubmit)
})










