require("dotenv").config()
const express = require("express")
const app = express()
const morgan = require("morgan")
const cors = require("cors")
const Person = require("./models/person")
const mongoose = require("mongoose")

const url = "mongodb+srv://FullStack2022:${password}@cluster0.tpymf.mongodb.net/phonebookApp?retryWrites=true&w=majority"
mongoose.connect(url)

app.use(express.json())
app.use(cors())
app.use(express.static("build"))
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :data")
)

morgan.token("data", (request) => {
  return JSON.stringify(request.body)
})

app.get("/info", (request, response, next) => {
  Person.find({})
    .then((people) => {
      response.send(
        `<p>Phonebook has info for ${
          people.length
        } people</p><p>${new Date()}</p>`
      )
    })
    .catch((error) => next(error))
})

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons.map(person => person.toJSON))
  })
})

app.post("/api/persons", (request, response, next) => {
  const { name, number } = request.body
  if (name === undefined || number === undefined) {
    return response.status(400).json({ error: "name or number is missing" })
  }

  const person = new Person({
    name: name,
    number: number,
  })

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson.toJSON)
    })
    .catch((error) => next(error))
})

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person.toJSON)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})


app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(request.params.id,
    { name, number },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedPerson) => {
      response.json(updatedPerson.toJSON)
    })
    .catch((error) => next(error))
})

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((person) => {
      response.json( person.toJSON)
    })
    .catch((error) => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" })
  } else if (error.name === "Validation Error") {
    return response.status(400).send({ error: "Validation Error" })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})