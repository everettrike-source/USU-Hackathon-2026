
export default function Home() {
    <>
        <div className = "bg-auto bg-red-600 text-white object-center">Meal Planner</div>
        <div className="flex flex-col md:flex-row items-center justify-between px-10 py-16">
            <div className="md:w-1/2 text-center md:text-left bg-black">

                <p className="text-lg text-white mb-6">
                Calculate your BMR, set weight goals, and generate custom
                meal plans tailored specifically to you.
                </p>
                
                <button className="bg-red text-white px-6 py-3 rounded-lg">
                Get Started
                </button>
            </div>
        </div>
    </>
}