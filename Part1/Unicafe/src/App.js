import {useState} from "react";

const Button = ({name, handleClick}) => {
  return (
    <button onClick={handleClick}>{name}</button>
  )
}
const Statistics = ({text, value}) => {
    return (
      <tr>
        <td>{text}</td>
        <td>{value}</td>
      </tr>
    )
  }
 
const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [all, setAll] = useState(0);

  const updateGood = () => {
    setGood(good+1)
    setAll(all+1)
  }
  const updateNeutral = () => {
    setNeutral(neutral+1)
    setAll(all+1)
  }
  const updateBad = () => {
    setBad(bad+1)
    setAll(all+1)
  }
  if(all!==0)
  {
  return (
    <div>
      <h1>Give Feedback</h1>
      <Button name="good" handleClick={updateGood} />
      <Button name="neutral" handleClick={updateNeutral} />
      <Button name="bad" handleClick={updateBad} />
      <h1>Statistics</h1>
      <table>
      <tbody>
      <Statistics text="good" value={good} />
      <Statistics text="neutral" value={neutral} />
      <Statistics text="bad" value={bad} />
      <Statistics text="all" value={all} />
      <Statistics text="average" value={(good-bad)/all} />
      <Statistics text="positive" value={(good/all)*100+"%"}/>
      </tbody>
      </table> 
      </div>
      )
    }
      else{
      return (
      <div>
      <h1>Give Feedback</h1>
      <Button name="good" handleClick={updateGood} />
      <Button name="neutral" handleClick={updateNeutral} />
      <Button name="bad" handleClick={updateBad} />
      <h1>Statistics</h1>
      <p>No feedback given</p>
      </div>

  )
}
}
export default App;
