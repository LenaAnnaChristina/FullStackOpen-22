
import React from 'react'
import personService from '../services/person'

const Persons = ({ filterPerson, setPersons, setMessage }) => {

    const Remove = (person) => {
    const result = window.confirm(`Delete ${person.name}?`)
        if (result) {
            personService
                .deletePerson(person.id)
                .then(_response => {
                    setPersons(filterPerson.filter(item => item !== person))
                    setMessage({
                        text: `Removed ${person.name} from phonebook`,
                        type: "success",
                    })
                })
                .catch((_error) => {
                    setMessage({
                        text: `Information of ${person.name} has already been removed from server`,
                        type: "extra",
                    })
                })
        }
    }

    return (
        filterPerson.map((person) =>
          <div key={person.name}>
            {person.name} {""} {person.number} {""}
                <button onClick={() => Remove(person)}>delete</button>
            </div>
        )
    )
}

export default Persons