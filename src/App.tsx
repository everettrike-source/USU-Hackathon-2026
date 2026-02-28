import { useState } from 'react'
import { calculateBaseCalories, bulkCutCalories, type UserInformation, type ExtraInformation } from './utils/NutritionCalculator'
import {type MealPlan, generateMealPlan, mealPlanToString} from './utils/MealPlanGenerator'

const PageTemplate = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-950 p-4 animate-in fade-in zoom-in-95 duration-300">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden">
        <div className="mt-6 mx-auto flex-col text-center max-w-sm items-center gap-x-4 rounded-xl bg-white p-6 shadow-lg outline outline-black/5 dark:bg-red-800/40 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
          <div>
            <div className="text-xl font-medium text-black dark:text-white">{title}</div>
            {subtitle && <p className="text-gray-500 dark:text-gray-400">{subtitle}</p>}
          </div>
        </div>
        <div className="p-8 space-y-6">
          {children}
        </div>
      </div>
    </div>
  )

  const InputField = ({ label, type = "text", placeholder, value, onChange, unit }: { label: string; type?: string; placeholder: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; unit?: string }) => (
    <div>
      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">{label}</label>
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full bg-zinc-950 text-white text-lg px-4 py-3.5 rounded-xl border border-zinc-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/50 outline-none transition-all placeholder:text-zinc-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        {unit && <span className="absolute right-4 top-4 text-zinc-600 font-bold">{unit}</span>}
      </div>
    </div>
  )

  const SelectField = ({ label, value, onChange, options }: { label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: { value: string; label: string }[] }) => (
    <div>
      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="w-full bg-zinc-950 text-white text-lg px-4 py-3.5 rounded-xl border border-zinc-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/50 outline-none transition-all"
      >
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    </div>
  )

  const ActionButton = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
    <button 
      onClick={onClick} 
      className="w-full mt-4 bg-white text-zinc-900 text-lg font-extrabold py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 transition-all active:scale-95 flex justify-center items-center gap-2"
    >
      {children} <span className="text-xl">➔</span>
    </button>
  )

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
        <PageTemplate title="BMR Calculator" subtitle="Enter your height!">
          <div className="space-y-5">
            <InputField label="Feet" type="number" placeholder="e.g. 5" value={feet} onChange={(e) => setFeet(e.target.value)} unit="ft" />
            <InputField label="Inches" type="number" placeholder="e.g. 10" value={inches} onChange={(e) => setInches(e.target.value)} unit="in" />
          </div>
          <ActionButton onClick={() => setShow(prev => prev + 1)}>Continue</ActionButton>
        </PageTemplate>
      )}

      {show === 1 && (
        <PageTemplate title="BMR Calculator" subtitle="Enter your weight!">
          <div className="space-y-5">
            <InputField label="Weight" type="number" placeholder="e.g. 180" value={weight} onChange={(e) => setWeight(e.target.value)} unit="lbs" />
          </div>
          <ActionButton onClick={() => setShow(prev => prev + 1)}>Continue</ActionButton>
        </PageTemplate>
      )}

      {show === 2 && (
        <PageTemplate title="BMR Calculator" subtitle="Enter your age!">
          <div className="space-y-5">
            <InputField label="Age" type="number" placeholder="e.g. 25" value={age} onChange={(e) => setAge(e.target.value)} unit="yrs" />
          </div>
          <ActionButton onClick={() => setShow(prev => prev + 1)}>Continue</ActionButton>
        </PageTemplate>
      )}

      {show === 3 && (
        <PageTemplate title="BMR Calculator" subtitle="Select your gender!">
          <div className="space-y-5">
            <SelectField 
              label="Gender" 
              value={gender} 
              onChange={(e) => setGender(e.target.value)} 
              options={[
                { value: "", label: "Select Gender" },
                { value: "male", label: "Male" },
                { value: "female", label: "Female" }
              ]}
            />
          </div>
          <ActionButton onClick={() => setShow(prev => prev + 1)}>Continue</ActionButton>
        </PageTemplate>
      )}

      {show === 4 && (
        <PageTemplate title="BMR Calculator" subtitle="Enter your activity level!">
          <div className="space-y-5">
            <InputField label="Activity Level" type="number" placeholder="e.g. 14" value={activity} onChange={(e) => setActivity(e.target.value)} unit="hrs/wk" />
            <InputField label="Intensity" type="number" placeholder="e.g. 5" value={intensity} onChange={(e) => setIntensity(e.target.value)} unit="2-10" />
          </div>
          <ActionButton onClick={handleCalculate}>Calculate</ActionButton>
        </PageTemplate>
      )}

      {show === 5 && (
        <PageTemplate title="BMR Calculator" subtitle="Set your goal!">
          <div className="space-y-5">
            <div className="bg-zinc-800 p-4 rounded-xl text-center">
              <p className="text-zinc-400 text-sm">Your BMR</p>
              <p className="text-3xl font-bold text-white mt-1">{BMR}</p>
            </div>
            <InputField label="Goal Weight" type="number" placeholder="e.g. 150" value={target} onChange={(e) => setTarget(e.target.value)} unit="lbs" />
            <InputField label="Timeline" type="number" placeholder="e.g. 3" value={months} onChange={(e) => setMonths(e.target.value)} unit="mos" />
          </div>
          <ActionButton onClick={handleBulkCutCalculate}>Calculate</ActionButton>
        </PageTemplate>
      )}

      {show === 6 && (
        <PageTemplate title="Your Calorie Goal" subtitle="Ready for meal planning?">
          <div className="space-y-5">
            <div className="bg-red-900/30 p-6 rounded-xl text-center border border-red-800">
              <p className="text-zinc-400 text-sm mb-2">Daily Calorie Target</p>
              <p className="text-5xl font-bold text-red-500">{calorieResult}</p>
              <p className="text-zinc-400 text-sm mt-2">calories per day</p>
            </div>
          </div>
          <ActionButton onClick={() => setShow(prev => prev + 1)}>Generate Meals</ActionButton>
        </PageTemplate>
      )}

      {show === 7 && (
        <PageTemplate title="Meal Plan Generator" subtitle="Tell us your dietary needs!">
          <div className="space-y-5">
            <InputField label="Restrictions" type="text" placeholder="e.g. Gluten-free, Vegan" value={restrictions} onChange={(e) => setRestrictions(e.target.value)} />
          </div>
          <ActionButton onClick={handleMealPlans}>Generate</ActionButton>
        </PageTemplate>
      )}

      {show === 8 && (
        <div className="flex flex-col items-center justify-center min-h-screen bg-stone-950 p-4">
          <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden">
            <div className="mt-6 mx-6 flex-col text-center max-w-full items-center gap-x-4 rounded-xl bg-white p-6 shadow-lg outline outline-black/5 dark:bg-red-800/40 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
              <div>
                <div className="text-xl font-medium text-black dark:text-white">Single Day Meal Plan</div>
                <p className="text-gray-500 dark:text-gray-400">Your personalized meal plan is ready. Review the meals below and save the days you like, or regenerate for new options. Once you've built your perfect plan, generate your master grocery list with one click.</p>
              </div>
            </div>
            <div className="p-8">
              <pre className="text-white text-sm whitespace-pre-wrap font-mono bg-zinc-950 p-6 rounded-xl border border-zinc-700 max-h-96 overflow-y-auto">
                {meals}
              </pre>
              <div className="mt-6 space-y-4">
                
                {/* Top Row: Accept and Decline */}
                <div className="flex gap-4">
                  <button 
                    onClick={() => console.log("Accepted!")}
                    className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-green-900/20 active:scale-95 flex items-center justify-center gap-2"
                  >
                     Accept Day
                  </button>
                  <button 
                    onClick={() => console.log("Declined!")}
                    className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-red-900/20 active:scale-95 flex items-center justify-center gap-2"
                  >
                     Decline & Retry
                  </button>
                </div>

                {/* Bottom Row: Generate List */}
                <button 
                  onClick={() => console.log("Generate List!")}
                  className="w-full bg-zinc-100 hover:bg-white text-zinc-900 text-lg font-extrabold py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:-translate-y-0.5 transition-all active:scale-95 flex justify-center items-center gap-2"
                >
                  Generate Shopping List
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
export default App
