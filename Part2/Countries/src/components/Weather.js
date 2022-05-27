import axios from 'axios'
import {useState, useEffect} from 'react' 

const Weather = ({capital}) => {
    const [weather, setWeather] = useState(null)
    const API_KEY = process.env.REACT_APP_WEATHER_API_KEY

  useEffect(() => {
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${API_KEY}`)
      .then(response => {setWeather(response.data)
      })
    }, [API_KEY,capital])

  if (weather === null) return null

    return (
    <div>
      <h2>Weather in {capital}</h2>
      <div>Temperature {weather.main.temp} Celsius</div>
      <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt="weather icon" />
      <div>Wind {weather.wind.speed} m/s</div>
    </div>
  ) 
    
}

export default Weather

