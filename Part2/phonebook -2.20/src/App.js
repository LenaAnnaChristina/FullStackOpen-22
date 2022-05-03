import React, { useState, useEffect } from 'react'
import Persons from './components/Persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Notification from './components/Notification'
import personService from './services/person'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [showPersons, setShowPersons] = useState([])
  const [message, setMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(originPersons => setPersons(originPersons))
      },[]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage(null);}, 5000);
      return () => {
      clearTimeout(timer);};
      }, [message]);

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => {setFilter(event.target.value)
    setShowPersons(persons.filter((person) =>
      (person.name.toLowerCase().includes(event.target.value.toLowerCase()))))
      }

  const addPerson = (event) => {event.preventDefault()
    const currentName = persons.map(event => event.name)
    const newPerson = {
      name: newName,
      number: newNumber
      }
    
    if (currentName.includes(`${newPerson.name}`)) {
      const previousPerson = persons.filter(event => event.name === newName)
      const _id = previousPerson.map(event => event.id)[0]
      const result = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)

      if (result) {
        personService
          .update(_id, newPerson)
          .then(returnedPerson => {
            setPersons(persons.map((person) => person.id !== returnedPerson.id ?  person : returnedPerson))
            setMessage({
              text: `Updated ${returnedPerson.name}`,
              type: "success",
              })
              })
            .catch(error => {setMessage({text: error.response.data.error, type: "fail"})
          })
        }
     } 

    else {
      personService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setMessage({
            text: `Added ${returnedPerson.name}`, 
            type: "success",
          })
          })
        .catch(error => {setMessage({text: error.response.data.error, type: "fail"
        })
     })
  }
  setNewName('')
  setNewNumber('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
        <Notification message={message} />
        <Filter 
          onChange={handleFilterChange} 
          value={filter} />
      <h2>add a new</h2>
        <PersonForm 
          addPerson={addPerson} 
          newName={newName}
          newNumber={newNumber}
          handleNameChange={handleNameChange}
          handleNumberChange={handleNumberChange} />

      <h2>Numbers</h2>
       {filter === '' ?
        <Persons 
          filterPerson={persons} 
          setPersons={setPersons} 
          setMessage={setMessage} />
        :
        <Persons 
          filterPerson={showPersons} 
          setPersons={setPersons} 
          setMessage={setMessage} />
      }
    </div>
  )
}

export default App