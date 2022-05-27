import Weather from "./Weather"

const Countries = ({ countries, setCountries }) => {

  if (countries.length > 10) { 
    return <p>Too many matches, specify another filter</p> }

  else if (countries.length === 1) {
    return countries.map((country) => {
      return (
        <div key={country.name.common}>
          <h1>{country.name.common}</h1>
          <div>Capital: {country.capital}</div>
          <div>Area: {country.area}</div>
          <h2>Languages:</h2>
          <div>
            {Object.values(country.languages).map((language, index) => { 
              return <li key={index}>{language}</li> })}
          </div>
          <br />
          <img src={country.flags.png} alt="flag" width="30%" />
          <Weather capital={country.capital} />
        </div>
      )
    })

  }
  else if (countries.length < 10) {
    return countries.map((country) => {
      return (
        <li key={country.name.common}>
          {country.name.common}
          <button onClick={() => {
            setCountries([country])
          }}>
            show {country.name.common}</button>
        </li>
      )
    })
  }
}

export default Countries
