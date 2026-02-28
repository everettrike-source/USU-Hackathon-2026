import { useState } from 'react'
import { calculateBaseCalories, bulkCutCalories, type UserInformation, type ExtraInformation } from './utils/NutritionCalculator'
import {type MealPlan, generateMealPlan, mealPlanToString} from './utils/MealPlanGenerator'

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
    catch (error: any) {
    // Using \n adds a line break in the alert box to make it readable
    alert(`Error Generating Plan:\n\n${error.message}`);
    }
  }

  return (
    <>
      {show==0 &&
      <>
        <div className="w-full bg-[#8a1e25] text-white py-5 text-center text-2xl font-bold">BMR Calculator</div>
        <div className="flex justify-center p-4">
          <div className="max-w-sm w-full p-8 bg-[#2f2f2f] rounded-xl flex flex-col gap-4">
            <h2 className="mb-4 text-white text-lg font-semibold">Enter Height</h2>
            <input
              type="number"
              placeholder="feet"
              value={feet}
              onChange={(e) => setFeet(e.target.value)}
              className="w-full mb-4 p-3 rounded border-none"
            />
            <input
              type="number"
              placeholder="inches"
              value={inches}
              onChange={(e) => setInches(e.target.value)}
              className="w-full mb-4 p-3 rounded border-none"
            />
            <button onClick={() => setShow(prev => prev+1)} className="w-full mb-4 p-3 rounded border-none bg-slate-600 text-white font-semibold cursor-pointer hover:bg-slate-700">Next</button>
          </div>
        </div>
      </>
      }
      {show==1 &&
      <>
        <div className="w-full bg-[#8a1e25] text-white py-5 text-center text-2xl font-bold">BMR Calculator</div>
        <div className="flex justify-center p-4">
          <div className="max-w-sm w-full p-8 bg-[#2f2f2f] rounded-xl flex flex-col gap-4">
            <h2 className="mb-4 text-white text-lg font-semibold">Enter Weight</h2>
            <input
              type="number"
              placeholder="weight (lbs)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full mb-4 p-3 rounded border-none"
            />
            <button onClick={() => setShow(prev => prev+1)} className="w-full mb-4 p-3 rounded border-none bg-slate-600 text-white font-semibold cursor-pointer hover:bg-slate-700">Next</button>
          </div>
        </div>
      </>
      }
      {show==2 &&
      <>
        <div className="w-full bg-[#8a1e25] text-white py-5 text-center text-2xl font-bold">BMR Calculator</div>
        <div className="flex justify-center p-4">
          <div className="max-w-sm w-full p-8 bg-[#2f2f2f] rounded-xl flex flex-col gap-4">
            <h2 className="mb-4 text-white text-lg font-semibold">Enter Age</h2>
            <input
              type="number"
              placeholder="age (years)"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full mb-4 p-3 rounded border-none"
            />
            <button onClick={() => setShow(prev => prev+1)} className="w-full mb-4 p-3 rounded border-none bg-slate-600 text-white font-semibold cursor-pointer hover:bg-slate-700">Next</button>
          </div>
        </div>
      </>
      }
      {show==3 &&
      <>
        <div className="w-full bg-[#8a1e25] text-white py-5 text-center text-2xl font-bold">BMR Calculator</div>
        <div className="flex justify-center p-4">
          <div className="max-w-sm w-full p-8 bg-[#2f2f2f] rounded-xl flex flex-col gap-4">
            <h2 className="mb-4 text-white text-lg font-semibold">Enter Gender</h2>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full mb-4 p-3 rounded border-none"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <button onClick={() => setShow(prev => prev+1)} className="w-full mb-4 p-3 rounded border-none bg-slate-600 text-white font-semibold cursor-pointer hover:bg-slate-700">Next</button>
          </div>
        </div>
      </>
      }
      {show==4 &&
      <>
        <div className="w-full bg-[#8a1e25] text-white py-5 text-center text-2xl font-bold">BMR Calculator</div>
        <div className="flex justify-center p-4">
          <div className="max-w-sm w-full p-8 bg-[#2f2f2f] rounded-xl flex flex-col gap-4">
            <h2 className="mb-4 text-white text-lg font-semibold">Enter Your activity level</h2>
            <input
              type="number"
              placeholder="number of hours active per week"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full mb-4 p-3 rounded border-none"
            />
            <input
              type="number"
              placeholder="intensity of activity from 2 - 10"
              value={intensity}
              onChange={(e) => setIntensity(e.target.value)}
              className="w-full mb-4 p-3 rounded border-none"
            />
            <button onClick={handleCalculate} className="w-full mb-4 p-3 rounded border-none bg-slate-600 text-white font-semibold cursor-pointer hover:bg-slate-700">Calculate BMR</button>
          </div>
        </div>
      </>
      }
      {show == 5 &&
      <>
        <div className="w-full bg-[#8a1e25] text-white py-5 text-center text-2xl font-bold">Goal Weight Calories Calculator</div>
        <div className="flex justify-center p-4">
          <div className="max-w-sm w-full p-8 bg-[#2f2f2f] rounded-xl flex flex-col gap-4">
            <h2 className="mb-4 text-white text-lg font-semibold">Your BMR is {BMR}</h2>
            <h2 className="mb-4 text-white text-lg font-semibold">Please enter your goal weight and months to achieve it</h2>
            <input
              type="number"
              placeholder="Goal Weight"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full mb-4 p-3 rounded border-none"
            />
            <input
              type="number"
              placeholder="Months to Reach goal"
              value={months}
              onChange={(e) => setMonths(e.target.value)}
              className="w-full mb-4 p-3 rounded border-none"
            />
            <button onClick={handleBulkCutCalculate} className="w-full mb-4 p-3 rounded border-none bg-slate-600 text-white font-semibold cursor-pointer hover:bg-slate-700">Calculate Daily Calories</button>
          </div>
        </div>
      </>
      }
      {show == 6 &&
      <>
        <div className="w-full bg-[#8a1e25] text-white py-5 text-center text-2xl font-bold">Your Daily Calories</div>
        <div className="flex justify-center p-4">
          <div className="max-w-sm w-full p-8 bg-[#2f2f2f] rounded-xl flex flex-col gap-4">
            <h2 className="mb-4 text-white text-lg font-semibold">Your daily calorie goal is: {calorieResult}</h2>
            <button onClick={() => setShow(prev => prev+1)} className="w-full mb-4 p-3 rounded border-none bg-slate-600 text-white font-semibold cursor-pointer hover:bg-slate-700">Find meal plans</button>
          </div>
        </div>
      </>
      }
      {show == 7 &&
      <>
        <div className="w-full bg-[#8a1e25] text-white py-5 text-center text-2xl font-bold">Meal Plan Generator</div>
        <div className="flex justify-center p-4">
          <div className="max-w-sm w-full p-8 bg-[#2f2f2f] rounded-xl flex flex-col gap-4">
            <h2 className="mb-4 text-white text-lg font-semibold">Enter any allergies or dietary restrictions</h2>
            <input
              type="string"
              placeholder="Dietary Restrictions"
              value={restrictions}
              onChange={(e) => setRestrictions(e.target.value)}
              className="w-full mb-4 p-3 rounded border-none"
            />
            <button onClick={handleMealPlans} className="w-full mb-4 p-3 rounded border-none bg-slate-600 text-white font-semibold cursor-pointer hover:bg-slate-700">Generate</button>
          </div>
        </div>
      </>
      }
      {show == 8 &&
      <>
        <div className="w-full bg-[#8a1e25] text-white py-5 text-center text-2xl font-bold">Meal Plan Generator</div>
        <div className="flex justify-center p-4">
          <div className="max-w-sm w-full p-8 bg-[#2f2f2f] rounded-xl flex flex-col gap-4">
            <h2 className="mb-4 text-white text-lg font-semibold">Here is your meal plan</h2>
            <h2 className="text-white text-sm whitespace-pre-wrap">{meals}</h2>
          </div>
        </div>
      </>
      }
    </>
  )
}
export default App
