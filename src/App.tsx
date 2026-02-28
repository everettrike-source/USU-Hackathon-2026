import { useState } from 'react'

import './App.css'



function App() {
  const [feet, setFeet] = useState<string>("")
  const [inches, setInches] = useState<string>("")
  const [weight, setWeight] = useState<string>("")
  const [gender, setGender] = useState<string>("")
  const [activity, setActivity] = useState<string>("")
  const [show, setShow] = useState<number>(0);
  const [target, setTarget] = useState<string>("")
  const [months, setMonths] = useState<string>("")
  const [BMR, setBMR] = useState<number>(0)
  const handleCalculate = () => 
  {
    const hFeet = Number(feet)
    const hInches = Number(inches)
    const w = Number(weight)
    const act = Number(activity)

    if (!hFeet || !hInches || !w || !gender || !act) {
      alert("Please fill out all fields correctly")
      setShow(0)
      return
    }
    
    const result = 0
    setBMR(result)
    setShow(show + 1)
  }

  return (
    <>
      {show==0 &&
      <>
        <div className = "banner">BMR Calculator</div>
        <div className = "content">
          <div className = "input-box">
            <h2>Enter Height</h2>
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
            <button onClick = {() => setShow(show + 1)}>Next</button>
          </div>
        </div>
      </>
      }
      {show==1 &&
      <>
        <div className = "banner">BMR Calculator</div>
        <div className = "content">
          <div className = "input-box">
            <h2>Enter Weight</h2>
            <input
              type="number"
              placeholder="weight (lbs)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
            <button onClick = {() => setShow(show + 1)}>Next</button>
          </div>
        </div>
      </>
      }
      {show==2 &&
      <>
        <div className = "banner">BMR Calculator</div>
        <div className = "content">
          <div className = "input-box">
            <h2>Enter Gender</h2>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <button onClick = {() => setShow(show + 1)}>Next</button>
          </div>
        </div>
      </>
      }
      {show==3 &&
      <>
        <div className = "banner">BMR Calculator</div>
        <div className = "content">
          <div className = "input-box">
            <h2>Enter Your activity level</h2>
            <input
              type="number"
              placeholder="number of hours active per week"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
            />
            <button onClick = {handleCalculate}>Calculate BMR</button>
          </div>
        </div>
      </>
      }
      {show == 4 &&
      <>
        <div className = "banner">Goal Weight Calories Calculator</div>
        <div className = "content">
          <div className = "input-box">
            <h2>Your BMR is {BMR}</h2>
            <h2>Please enter your goal weight and months to achieve it</h2>
            <input
              type = "number"
              placeholder = "Goal Weight"
              value = {target}
              onChange={(e) => setTarget(e.target.value)}
            />
            <input
              type = "number"
              placeholder = "Months to Reach goal"
              value = {months}
              onChange={(e) => setMonths(e.target.value)}
            />
            
          </div>
        </div>
      </>
      }
    </>
  )
}

export default App
