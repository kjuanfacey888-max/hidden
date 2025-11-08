import React from 'react';
import { CheckCircleIcon, LogoIcon } from './icons';

interface LandingPageProps {
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  return (
    <div className="bg-white text-gray-800 font-sans">
      <div className="container mx-auto px-6">
        {/* Header */}
        <header className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-2">
            <LogoIcon className="w-8 h-8"/>
            <span className="text-xl font-bold">F.A.C.E.Y</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-purple-600 font-semibold">Home</a>
            <a href="#" className="text-gray-600 hover:text-purple-600 font-semibold">About</a>
            <a href="#" className="text-gray-600 hover:text-purple-600 font-semibold">Products</a>
            <a href="#" className="text-gray-600 hover:text-purple-600 font-semibold">Pricing</a>
          </nav>
          <button onClick={onLogin} className="bg-purple-100 text-purple-700 font-bold py-2 px-5 rounded-lg hover:bg-purple-200 transition-colors">
            Login
          </button>
        </header>

        {/* Hero Section */}
        <section className="text-center py-20">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Build Smarter Financial Habits <br /> with <span className="text-purple-600">Ethical AI</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            Empower your financial future and protect your privacy with AI solutions that prioritize transparency, fairness, and performance.
          </p>
          <div className="mt-8 flex justify-center">
             <button onClick={onLogin} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              Get Started Free
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold">Endorsed by the Best in the Business</h2>
            <p className="text-gray-600 mt-2">From global brands to fast-growing startups, our work earns recognition from the people who matter most.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-2xl shadow-sm">
              <h3 className="text-xl font-bold">Automated Budgeting</h3>
              <p className="mt-2 text-gray-600">Collaborate effortlessly—whether you're a team of 2 people or 200—with one unified workspace.</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl shadow-sm">
              <h3 className="text-xl font-bold">AI-Powered Insights</h3>
              <p className="mt-2 text-gray-600">No delays. No digging. Just the data you need, exactly when and where you need it.</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl shadow-sm">
              <h3 className="text-xl font-bold">Privacy. Protected Always.</h3>
              <p className="mt-2 text-gray-600">Your data is never shared, sold, or exposed—and it never will be.</p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 bg-white">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold">Simple Pricing for Every Team</h2>
            <p className="text-gray-600 mt-2">Choose a plan that fits your goals—no hidden fees, no surprises.</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <div className="border border-gray-200 rounded-2xl p-8">
              <h3 className="text-2xl font-bold">Starter</h3>
              <p className="text-gray-500 mt-2">Perfect for individuals or small teams just getting started.</p>
              <p className="text-5xl font-bold mt-6">$0<span className="text-lg font-medium text-gray-500">/per month</span></p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" /> Basic analytics & dashboards</li>
                <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" /> Limited Integrations</li>
                <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" /> Email support</li>
              </ul>
              <button onClick={onLogin} className="w-full mt-8 py-3 px-6 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-100 transition-colors">Get Started Free</button>
            </div>
            {/* Pro Plan */}
            <div className="border-2 border-purple-500 rounded-2xl p-8 shadow-2xl shadow-purple-200 relative">
               <span className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">POPULAR</span>
              <h3 className="text-2xl font-bold">Pro</h3>
              <p className="text-gray-500 mt-2">For growing teams that need advanced features and customization.</p>
              <p className="text-5xl font-bold mt-6">$29<span className="text-lg font-medium text-gray-500">/per month</span></p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" /> Everything in Starter</li>
                <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" /> Advanced analytics</li>
                <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" /> Automation & workflows</li>
                <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" /> API access</li>
              </ul>
              <button onClick={onLogin} className="w-full mt-8 py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity">Get Access</button>
            </div>
            {/* Enterprise Plan */}
            <div className="border border-gray-200 rounded-2xl p-8">
              <h3 className="text-2xl font-bold">Enterprise</h3>
              <p className="text-gray-500 mt-2">For large organizations with advanced needs.</p>
              <p className="text-5xl font-bold mt-6">$~<span className="text-lg font-medium text-gray-500">/per month</span></p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" /> Everything in Pro</li>
                <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" /> Dedicated account manager</li>
                <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" /> Custom integrations</li>
              </ul>
              <button onClick={onLogin} className="w-full mt-8 py-3 px-6 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-100 transition-colors">Contact Sales</button>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold">Proven by People Who Use It</h2>
            <p className="text-gray-600 mt-2">Join thousands of satisfied users who use our platform to power their workflows every day.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-8 rounded-2xl">
              <p className="text-gray-600">"Everything just works—and that's rare. We've tried multiple tools for internal collaboration, but this one stood out for its clarity and ease of use. The UI is not only beautifully designed, but it actually works."</p>
              <div className="mt-4 flex items-center">
                <img src="https://i.pravatar.cc/40?u=sarah" alt="Sarah M" className="w-10 h-10 rounded-full mr-3"/>
                <div>
                  <p className="font-bold">Sarah M.</p>
                  <p className="text-sm text-gray-500">Product Manager</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl">
              <p className="text-gray-600">"As a fast-scaling startup, we needed a tool that could grow with us—and this platform delivered. We were able to onboard our team in less than a week without any steep learning curve."</p>
              <div className="mt-4 flex items-center">
                <img src="https://i.pravatar.cc/40?u=leo" alt="Leo J" className="w-10 h-10 rounded-full mr-3"/>
                <div>
                  <p className="font-bold">Leo J.</p>
                  <p className="text-sm text-gray-500">CTO</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 mt-20">
        <div className="container mx-auto px-6 py-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} F.A.C.E.Y. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
