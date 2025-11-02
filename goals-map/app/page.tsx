import Image from "next/image";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-5xl font-bold mb-6">
            Track Your Goals with Visual Goal Mapping
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Transform your goals into achievable milestones with our interactive goal mapping platform
          </p>
          <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700">
            Start Mapping Your Goals
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-white dark:bg-zinc-900">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Visual Goal Mapping",
                description: "Create interactive mind maps to visualize your goals and progress"
              },
              {
                title: "Progress Tracking",
                description: "Monitor your achievements and stay motivated with progress indicators"
              },
              {
                title: "Milestone Planning",
                description: "Break down your goals into manageable milestones and tasks"
              }
            ].map((feature, index) => (
              <div key={index} className="p-6 rounded-lg border dark:border-zinc-800">
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
