import React from 'react';

const Header = (props) => {
  return (
    <h1>{props.course}</h1>
  )
}
const Part = ({name,number}) => {
  return (
    <p>{name}, {number}</p>
  )
}
const Content = ({parts}) => {
  const [p1,p2,p3]=parts;
  return (
    <div>
    <Part name = {p1.name} number={p1.excercises}/>
    <Part name = {p2.name} number={p2.excercises}/>
    <Part name = {p3.name} number={p3.excercises}/>
    </div>
  )
}
const Total = ({parts}) => {
  const [p1,p2,p3]=parts;
  return (
    <p>Number of excercises, {p1.excercises+p2.excercises+p3.excercises}</p>
  )
}
const App = () => {
  const course = {
   name : "Half Stack application development",
   parts : [
    {
    name: "Fundamentals of React",
    excercises: 10
  },
  {
    name: "Using props to pass data",
    excercises: 7
  },
  {
    name: "State of a component",
    excercises: 14
  }
  ]
}

  return (
    <div>
      <Header course={course.name}/>
      <Content parts={course.parts}  />
      <Total parts={course.parts}    />
    </div>
  )
}

export default App;