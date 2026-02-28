import { useState } from 'react'
import { calculateBaseCalories, bulkCutCalories, type UserInformation, type ExtraInformation } from './utils/NutritionCalculator'
import {type MealPlan, generateMealPlan, mealPlanToString} from './utils/MealPlanGenerator'
import { ShoppingListManager } from './utils/MealsTooIngredientsList'
import { findGroceryStores, type GrocerySearchResult } from './utils/GroceryStoreLocator'

const PageTemplate = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-stone-950 p-4 animate-in fade-in zoom-in-95 duration-300">
    <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden">
      <div className="mt-6 mx-6 flex-col text-center max-w-sm items-center gap-x-4 rounded-xl bg-white p-6 shadow-lg outline outline-black/5 dark:bg-red-800/40 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
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
        className="w-full bg-zinc-950 text-white text-lg px-4 py-3.5 rounded-xl border border-zinc-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/50 outline-none transition-all placeholder:text-zinc-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none[&::-webkit-inner-spin-button]:appearance-none"
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

const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-stone-950">
    <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden p-12 text-center">
      <div className="flex justify-center mb-6">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-zinc-700 border-t-red-500"></div>
      </div>
      <p className="text-white text-lg font-semibold">Generating your meal plan...</p>
      <p className="text-zinc-400 text-sm mt-2">This may take a moment</p>
    </div>
  </div>
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
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [currentMealPlan, setCurrentMealPlan] = useState<MealPlan | null>(null)
  const [shoppingManager] = useState(() => new ShoppingListManager())
  const [groceryResults, setGroceryResults] = useState<GrocerySearchResult | null>(null)
  const [userLocation, setUserLocation] = useState<string>("")
  const [isLoadingGroceries, setIsLoadingGroceries] = useState(false)

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
      setShow(1)
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
    setIsLoading(true)
    try
    {
      const plan = await generateMealPlan(calorieResult, restrictions)

      const planString = mealPlanToString(plan)

      setMeals(planString)
      setCurrentMealPlan(plan)
      setShow(8);
    }
    catch (error: any) {
    // Using \n adds a line break in the alert box to make it readable
    alert(`Error Generating Plan:\n\n${error.message}`);
    setShow(7);
    }
    finally {
    setIsLoading(false);
  }
  }

  const handleAcceptMeal = async () => {
    if (currentMealPlan) {
      shoppingManager.addDayToPlan(currentMealPlan)
    }
    await generateNewMealPlan()
  }

  const handleDeclineMeal = async () => {
    await generateNewMealPlan()
  }

  const generateNewMealPlan = async () => {
    setIsLoading(true)
    try {
      const plan = await generateMealPlan(calorieResult, restrictions)
      const planString = mealPlanToString(plan)
      setMeals(planString)
      setCurrentMealPlan(plan)
    } catch (error: any) {
      alert(`Error Generating Plan:\n\n${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateShoppingList = async () => {
    if (!userLocation.trim()) {
      alert("Please enter your location")
      return
    }

    try {
      setIsLoadingGroceries(true)
      const ingredients = shoppingManager.generateFinalShoppingList()
      
      // Parse ingredients string to Ingredient array
      const parsedIngredients = ingredients.map(ing => {
        const parts = ing.split(' ')
        const quantity = parseInt(parts[0].replace('x', '')) || 1
        const unit = parts[1] || 'item'
        const name = parts.slice(parts[0].match(/\d/) ? 2 : 1).join(' ')
        return { name, quantity, unit }
      })

      const result = await findGroceryStores(userLocation, parsedIngredients)
      setGroceryResults(result)
      setShow(10)
    } catch (error: any) {
      alert(`Error generating shopping list:\n\n${error.message}`)
    } finally {
      setIsLoadingGroceries(false)
    }
  }

  // Show loading screen if loading
  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <>
      {show === 0 && (
        <>
          <div className="bg-black min-h-screen flex flex-col items-center">
            <div className="bg-red-600 text-white h-32 w-full flex items-center justify-center text-4xl font-bold rounded-b-3xl shadow-lg">
              Meal Planner
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between px-10 py-12 w-full max-w-6xl">
              <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
                <p className="text-lg text-white mb-6">
                  Calculate your BMR, set weight goals, and generate custom
                  meal plans tailored specifically to you.
                </p>
                <button 
                  className="bg-red-600 text-white px-6 py-3 rounded-lg"
                  onClick={() => setShow(prev => prev + 1)}
                >
                  Get Started
                </button>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <img
                  src="/Healthy-Food.jpg"
                  alt="Fitness"
                  className="max-w-md w-full rounded-xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </>
      )}

      {show === 1 && (
        <PageTemplate title="BMR Calculator" subtitle="Enter your height!">
          <div className="space-y-5">
            <InputField label="Feet" type="number" placeholder="e.g. 5" value={feet} onChange={(e) => setFeet(e.target.value)} unit="ft" />
            <InputField label="Inches" type="number" placeholder="e.g. 10" value={inches} onChange={(e) => setInches(e.target.value)} unit="in" />
          </div>
          <ActionButton onClick={() => setShow(prev => prev + 1)}>Continue</ActionButton>
        </PageTemplate>
      )}

      {show === 2 && (
        <PageTemplate title="BMR Calculator" subtitle="Enter your weight!">
          <div className="space-y-5">
            <InputField label="Weight" type="number" placeholder="e.g. 180" value={weight} onChange={(e) => setWeight(e.target.value)} unit="lbs" />
          </div>
          <ActionButton onClick={() => setShow(prev => prev + 1)}>Continue</ActionButton>
        </PageTemplate>
      )}

      {show === 3 && (
        <PageTemplate title="BMR Calculator" subtitle="Enter your age!">
          <div className="space-y-5">
            <InputField label="Age" type="number" placeholder="e.g. 25" value={age} onChange={(e) => setAge(e.target.value)} unit="yrs" />
          </div>
          <ActionButton onClick={() => setShow(prev => prev + 1)}>Continue</ActionButton>
        </PageTemplate>
      )}

      {show === 4 && (
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

      {show === 5 && (
        <PageTemplate title="BMR Calculator" subtitle="Enter your activity level!">
          <div className="space-y-5">
            <InputField label="Activity Level" type="number" placeholder="e.g. 14" value={activity} onChange={(e) => setActivity(e.target.value)} unit="hrs/wk" />
            <InputField label="Intensity" type="number" placeholder="e.g. 5" value={intensity} onChange={(e) => setIntensity(e.target.value)} unit="2-10" />
          </div>
          <ActionButton onClick={handleCalculate}>Calculate</ActionButton>
        </PageTemplate>
      )}

      {show === 6 && (
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

      {show === 7 && (
        <PageTemplate title="Your Calorie Goal" subtitle="Ready for meal planning?">
          <div className="space-y-5">
            <div className="bg-red-900/30 p-6 rounded-xl text-center border border-red-800">
              <p className="text-zinc-400 text-sm mb-2">Daily Calorie Target</p>
              <p className="text-5xl font-bold text-red-500">{calorieResult}</p>
              <p className="text-zinc-400 text-sm mt-2">calories per day</p>
            </div>
          </div>
          <div className="space-y-5 mt-6">
            <InputField 
              label="Restrictions" 
              type="text" 
              placeholder="e.g. Gluten-free, Vegan" 
              value={restrictions} 
              onChange={(e) => setRestrictions(e.target.value)} 
            />
          </div>
          <ActionButton onClick={handleMealPlans}>Generate Meals</ActionButton>
        </PageTemplate>
      )}

      {show === 8 && (
        <div className="flex flex-col items-center justify-center min-h-screen bg-stone-950 p-4 animate-in fade-in zoom-in-95 duration-300">
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
                    onClick={handleAcceptMeal}
                    className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-green-900/20 active:scale-95 flex items-center justify-center gap-2"
                  >
                      Accept Day
                   </button>
                   <button 
                    onClick={handleDeclineMeal}
                    className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-red-900/20 active:scale-95 flex items-center justify-center gap-2"
                   >
                      Decline & Retry
                   </button>
                 </div>

                 {/* Bottom Row: Generate List */}
                 <button 
                   onClick={() => setShow(9)}
                   className="w-full bg-zinc-100 hover:bg-white text-zinc-900 text-lg font-extrabold py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:-translate-y-0.5 transition-all active:scale-95 flex justify-center items-center gap-2"
                 >
                   Generate Shopping List
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}

       {show === 9 && (
         <PageTemplate title="Shopping List" subtitle="Where should we shop?">
           <div className="space-y-5">
             <div className="bg-zinc-800 p-4 rounded-xl text-center">
               <p className="text-zinc-400 text-sm">Meals Accepted</p>
               <p className="text-3xl font-bold text-white mt-1">{shoppingManager.getPlanCount()}</p>
             </div>
             <InputField 
               label="Location" 
               type="text" 
               placeholder="e.g. Salt Lake City, UT" 
               value={userLocation} 
               onChange={(e) => setUserLocation(e.target.value)} 
             />
           </div>
           <button 
             onClick={handleGenerateShoppingList}
             disabled={isLoadingGroceries}
             className="w-full mt-4 bg-white text-zinc-900 text-lg font-extrabold py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 transition-all active:scale-95 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
           >
             {isLoadingGroceries ? 'Loading...' : 'Find Stores'} <span className="text-xl">🛒</span>
           </button>
         </PageTemplate>
       )}

       {show === 10 && groceryResults && (
         <div className="flex flex-col items-center justify-center min-h-screen bg-stone-950 p-4">
           <div className="w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden">
             <div className="mt-6 mx-6 flex-col text-center max-w-full items-center gap-x-4 rounded-xl bg-white p-6 shadow-lg outline outline-black/5 dark:bg-red-800/40 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
               <div>
                 <div className="text-xl font-medium text-black dark:text-white">Grocery Stores Near You</div>
                 <p className="text-gray-500 dark:text-gray-400">Best prices for your ingredients</p>
               </div>
             </div>
             <div className="p-8 space-y-6 max-h-[500px] overflow-y-auto">
               {groceryResults.stores.map((store, idx) => (
                 <div key={idx} className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
                   <div className="flex justify-between items-start mb-4">
                     <div>
                       <h3 className="text-xl font-bold text-white">{store.name}</h3>
                       <p className="text-zinc-400 text-sm">{store.location}</p>
                       <p className="text-zinc-500 text-xs mt-1">{store.distance.toFixed(1)} miles away</p>
                     </div>
                     <div className="text-right">
                       <p className="text-3xl font-bold text-green-500">${store.totalPrice.toFixed(2)}</p>
                       {!store.hasAllIngredients && <p className="text-xs text-red-400 mt-1">Missing items</p>}
                     </div>
                   </div>
                   <div className="text-xs text-zinc-400 space-y-1">
                     {store.priceBreakdown.slice(0, 3).map((item, i) => (
                       <p key={i}>{item.quantity} {item.unit} {item.ingredient} - ${item.price.toFixed(2)}</p>
                     ))}
                     {store.priceBreakdown.length > 3 && <p className="text-zinc-500">+{store.priceBreakdown.length - 3} more items</p>}
                   </div>
                 </div>
               ))}
             </div>
           </div>
         </div>
       )}
     </>
   )
 }
 export default App
