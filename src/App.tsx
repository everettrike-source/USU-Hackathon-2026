import { useState } from 'react'

import './App.css'

function App() {
  const [feet, setFeet] = useState<string>("")
  const [inches, setInches] = useState<string>("")
  const [weight, setWeight] = useState<string>("")
  const [gender, setGender] = useState<string>("")
  const [activity, setActivity] = useState<string>("")

  return (
    <>
      <div className = "banner">BMR Calculator</div>
      <div className = "content">
        <div className = "input-box">
          <h2>Please enter your information below to calculate your BMR</h2>
          <input
            type="number"
            placeholder="feet"
            value={feet}
            onChange={(e) => setFeet(e.target.value)}
          />
          <input
            type="number"
            placeholder="inches"
            value={inches}
            onChange={(e) => setInches(e.target.value)}
          />
          <input
            type="number"
            placeholder="weight (lbs)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <input
            type="number"
            placeholder="# of hours active per week"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
          />
          <button>Calculate BMR and target calories</button>
        </div>
      </div>
    </>
  )
}

export default App
