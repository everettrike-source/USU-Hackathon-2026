import { useState } from 'react'
import { calculateBaseCalories, bulkCutCalories, type UserInformation, type ExtraInformation } from './utils/NutritionCalculator'
import {type MealPlan, generateMealPlan, mealPlanToString} from './utils/MealPlanGenerator'
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
  const [age, setAge] = useState<string>("")
  const [intensity, setIntensity] = useState<string>("")
  const [calorieResult, setCalorieResult] = useState<number>(0)
  const [restrictions, setRestrictions] = useState<string>("")
  const [meals, setMeals] = useState<string>("")
  
  const handleCalculate = () => 
  {
    const hFeet = Number(feet)
    const hInches = Number(inches)
    const w = Number(weight)
    const act = Number(activity)
    const userAge = Number(age)
    const intense = Number(intensity)

    if (!hFeet || !hInches || !w || !gender || !act || !userAge || !intense) {
      alert("Please fill out all fields correctly")
      setShow(0)
      return
    }
    
    const user: UserInformation = {
      age: userAge,
      weight: w,
      gender: gender as 'male' | 'female',
      activityLevel: act,
      heightFoot: hFeet,
      heightInches: hInches,
      activityIntensity: intense
    }
    
    const bmrResult = calculateBaseCalories(user)
    setBMR(bmrResult)
    setShow(prev => prev+1)
  }

  const handleBulkCutCalculate = () => {
    const goalWeight = Number(target)
    const monthsToTarget = Number(months)
    const hFeet = Number(feet)
    const hInches = Number(inches)
    const w = Number(weight)
    const act = Number(activity)
    const userAge = Number(age)
    const intense = Number(intensity)

    const user: UserInformation = {
      age: userAge,
      weight: w,
      gender: gender as 'male' | 'female',
      activityLevel: act,
      heightFoot: hFeet,
      heightInches: hInches,
      activityIntensity: intense
    }


    const extra: ExtraInformation = {
      targetMonth: monthsToTarget,
      targetWeight: goalWeight
    }

    if (!goalWeight || !monthsToTarget) {
      alert("Please fill out all fields")
      return
    }

    const result = bulkCutCalories(user, extra)
    setShow(prev => prev+1)
    setCalorieResult(result)
  }

  const handleMealPlans = async () => {
    try
    {
      const plan = await generateMealPlan(calorieResult, restrictions)

      const planString = mealPlanToString(plan)

      setMeals(planString)
      setShow(prev => prev+1)
    }
    catch
    {
      alert("Error Generating Plan")
    }
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
            <button onClick = {() => setShow(prev => prev+1)}>Next</button>
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
            <button onClick = {() => setShow(prev => prev+1)}>Next</button>
          </div>
        </div>
      </>
      }
      {show==2 &&
      <>
        <div className = "banner">BMR Calculator</div>
        <div className = "content">
          <div className = "input-box">
            <h2>Enter Age</h2>
            <input
              type="number"
              placeholder="age (years)"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
            <button onClick = {() => setShow(prev => prev+1)}>Next</button>
          </div>
        </div>
      </>
      }
      {show==3 &&
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
            <button onClick = {() => setShow(prev => prev+1)}>Next</button>
          </div>
        </div>
      </>
      }
      {show==4 &&
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
            <input
              type="number"
              placeholder="intensity of activity from 2 - 10"
              value = {intensity}
              onChange={(e) => setIntensity(e.target.value)}
              />
            
            <button onClick = {handleCalculate}>Calculate BMR</button>
          </div>
        </div>
      </>
      }
      {show == 5 &&
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
            <button onClick={handleBulkCutCalculate}>Calculate Daily Calories</button>
          </div>
        </div>
      </>
      }
      {show == 6 &&
      <>
        <div className = "banner">Your Daily Calories</div>
        <div className = "content">
          <div className = "input-box">
            <h2>Your daily calorie goal is: {calorieResult}</h2>
            <button onClick = {() => setShow(prev => prev+1)}>Find meal plans</button>
          </div>
        </div>
      </>
      }
      {show == 7 &&
      <>
        <div className = "banner">Meal Plan Generator</div>
        <div className = "content">
          <div className = "input-box">
            <h2>Enter any allergies or dietary restrictions</h2>
            <input
              type="string"
              placeholder="Dietary Restrictions"
              value={restrictions}
              onChange={(e) => setRestrictions(e.target.value)}
            />
            <button onClick = {handleMealPlans}>Generate</button>
          </div>
        </div>
      </>
      }
      {show == 8 &&
      <>
        <div className = "banner">Meal Plan Generator</div>
        <div className = "content">
          <div className = "input-box">
            <h2>Here is your meal plan</h2>
            <h2>{meals}</h2>
          </div>
        </div>
      </>
      }
    </>
  )
}
export default App
