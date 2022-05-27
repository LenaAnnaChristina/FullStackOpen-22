import { useState, useEffect } from "react"
import axios from "axios"
import Countries from "./components/Countries"

const API_KEY = process.env.REACT_APP_API_WEATHER

const App = () => {
  const [countries, setCountries] = useState([])

  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all").then((response) => {
      setCountries(response.data)
    })
  }, [])

  const handleFilter = (event) => {
    event.preventDefault()
    const filterCountries = countries.filter(country => (
      country.name.common.toLowerCase().includes(event.target.value.toLowerCase())))
    setCountries(filterCountries)
  }

  return (
    <div>
      <div>
        Find countries <input onChange={handleFilter} />
      </div>
      <Countries countries={countries} setCountries={setCountries}  />
    </div>
  )
}

export default App
