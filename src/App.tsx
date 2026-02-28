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
      {show === 0 && (
        <div className="flex flex-col items-center justify-center min-h-screen bg-stone-950 p-4 animate-in fade-in zoom-in-95 duration-300">
          
          {/* The Main Card Container */}
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden">
            
            {/* Sleek Gradient Header */}
            <div className="mt-6 mx-6 flex-col text-center max-w-sm items-center gap-x-4 rounded-xl bg-white p-6 shadow-lg outline outline-black/5 dark:bg-red-800/40 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
            <div>
            <div className="text-xl font-medium text-black dark:text-white">BMR Calculator</div>
              <p className="text-gray-500 dark:text-gray-400">Enter your height!</p>
            </div>
            </div>
            {/* Input Form Area */}
            <div className="p-8 space-y-6">
              
              <div className="space-y-5">
                {/* Feet Input Group */}
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Feet</label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="e.g. 5"
                      value={feet}
                      onChange={(e) => setFeet(e.target.value)}
                      className="w-full bg-zinc-950 text-white text-lg px-4 py-3.5 rounded-xl border border-zinc-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/50 outline-none transition-all placeholder:text-zinc-600"
                    />
                    <span className="absolute right-4 top-4 text-zinc-600 font-bold">ft</span>
                  </div>
                </div>

                {/* Inches Input Group */}
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Inches</label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="e.g. 10"
                      value={inches}
                      onChange={(e) => setInches(e.target.value)}
                      className="w-full bg-zinc-950 text-white text-lg px-4 py-3.5 rounded-xl border border-zinc-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/50 outline-none transition-all placeholder:text-zinc-600"
                    />
                    <span className="absolute right-4 top-4 text-zinc-600 font-bold">in</span>
                  </div>
                </div>
              </div>

              {/* High-Converting Action Button */}
              <button 
                onClick={() => setShow(prev => prev + 1)} 
                className="w-full mt-4 bg-white text-zinc-900 text-lg font-extrabold py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 transition-all active:scale-95 flex justify-center items-center gap-2"
              >
                Continue <span className="text-xl">➔</span>
              </button>
              
            </div>
          </div>
        </div>
      )}
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
