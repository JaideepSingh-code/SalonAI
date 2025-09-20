import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-primary-700 to-primary-900 text-white">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">SalonAI</h1>
          <div className="space-x-4">
            <Link href="/login" className="hover:text-primary-200 transition-colors">
              Login
            </Link>
            <Link href="/login" className="bg-white text-primary-700 px-4 py-2 rounded-lg font-medium hover:bg-primary-50 transition-colors">
              Get Started
            </Link>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <h2 className="text-5xl font-bold mb-6">
            Smart Salon Management,
            <br />
            <span className="text-primary-200">Powered by AI</span>
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Streamline appointments, get personalized style recommendations,
            and elevate your salon experience with intelligent automation.
          </p>
          <div className="space-x-4">
            <Link href="/login" className="bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-primary-50 transition-colors inline-block">
              Book Appointment
            </Link>
            <Link href="/services" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white/10 transition-colors inline-block">
              View Services
            </Link>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Why Choose SalonAI?
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            title="AI Recommendations"
            description="Get personalized hairstyle and color suggestions based on your face shape, preferences, and history."
            icon="✨"
          />
          <FeatureCard
            title="Smart Scheduling"
            description="Book appointments with real-time availability. No more phone calls or double bookings."
            icon="📅"
          />
          <FeatureCard
            title="Price Estimates"
            description="Know exactly what to expect. Get instant price quotes based on your selected services."
            icon="💰"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p>&copy; 2025 SalonAI. Built with Next.js and Flask.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="card text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h4 className="text-xl font-semibold mb-2 text-gray-800">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
