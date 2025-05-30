import React from "react";
import { Star, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../Components/Header";

const features = [
  {
    title: "Group-based Splitting",
    description:
      "Create or join groups using unique Group IDs and track all shared expenses easily.",
  },
  {
    title: "Real-Time Sync",
    description:
      "All inputs are synced instantly across users to avoid confusion or mismatches.",
  },
  {
    title: "Smart Balancing",
    description:
      "Automated balance calculations showing who owes what to whom with clarity.",
  },
  {
    title: "Email Reminders",
    description:
      "Get email alerts for pending dues and ensure timely settlements.",
  },
];

const comparisons = [
  { metric: "Ease of Use", splitit: "✅", traditional: "❌" },
  { metric: "Multi-User Input", splitit: "✅", traditional: "❌" },
  { metric: "Automatic Calculations", splitit: "✅", traditional: "❌" },
  { metric: "Email Notifications", splitit: "✅", traditional: "❌" },
];

const reviews = [
  "SplitIt made our group trip so easy to manage! – Aditi",
  "Finally, no more arguments about money after parties. – Raj",
  "Email reminders saved me from being the 'bad guy'. – Sneha",
  "It’s so intuitive, even my dad uses it for family expenses! – Arun",
];

export default function LandingPage() {
  return (
    <div className="font-sans text-amber-500 scroll-smooth">
      {/* Header */}
      <Header />

      {/* Front Cover */}
      <section className="relative min-h-screen w-full bg-blue-100">
        <img
          src="./frontPg.png"
          alt="SplitIt Front Cover"
          className="relative inset-0 w-full h-screen object-cover opacity-90"
        />

        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 ">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 px-6 py-3 rounded-xl text-white">
            Simplify Group Expenses with SplitIt
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-white px-4 py-2 rounded-xl  ">
            Track, split, and settle expenses with ease all in real time.
          </p>
          <Link
            to="/login"
            className="text-lg sm:text-xl md:text-2xl bg-amber-600 text-white px-4 py-2 rounded-xl my-4 cursor-pointer hover:bg-amber-500 transition-colors"
          >
            Login
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 bg-amber-700 text-white px-4 min-h-screen flex flex-col justify-center"
      >
        <h3 className="text-6xl font-semibold text-center mb-12 text-amber-500">
          Core Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white text-gray-800 p-6 rounded-xl shadow"
            >
              <h4 className="text-xl font-bold mb-2 flex items-center">
                <CheckCircle className="text-green-600 mr-2" /> {feature.title}
              </h4>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section
        id="comparison"
        className="bg-cyan-700 py-20 px-4 min-h-screen flex flex-col justify-center"
      >
        <h3 className="text-3xl font-semibold text-center mb-12">
          Why SplitIt Beats the Old Way
        </h3>
        <div className="max-w-3xl mx-auto overflow-x-auto">
          <table className="w-full table-auto border border-gray-200 text-sm sm:text-base">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">Feature</th>
                <th className="border p-3">SplitIt</th>
                <th className="border p-3">Traditional</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((item, idx) => (
                <tr key={idx} className="text-center">
                  <td className="border p-3 text-left">{item.metric}</td>
                  <td className="border p-3">{item.splitit}</td>
                  <td className="border p-3">{item.traditional}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="bg-gray-50 py-20 px-4 ">
        <h3 className="text-3xl font-semibold text-center mb-12">
          What Users Say
        </h3>

        <div className="max-w-6xl mx-auto overflow-x-auto flex gap-6 px-4 pb-4 snap-x snap-mandatory scroll-smooth">
          {reviews.map((review, i) => (
            <div
              key={i}
              className="min-w-[300px] max-w-sm bg-white shadow-lg rounded-2xl p-6 flex-shrink-0 snap-start"
            >
              <div className="flex items-center mb-4 gap-3">
                <div className="bg-indigo-200 w-10 h-10 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                  {review.split("–")[1]?.trim()?.charAt(0) || "U"}
                </div>
                <p className="font-semibold">
                  {review.split("–")[1]?.trim() || "User"}
                </p>
              </div>

              <p className="text-gray-700 italic">
                “{review.split("–")[0].trim()}”
              </p>

              <div className="flex justify-end mt-4 text-yellow-400">
                <Star className="w-5 h-5" />
                <Star className="w-5 h-5" />
                <Star className="w-5 h-5" />
                <Star className="w-5 h-5" />
                <Star className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-300 py-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div>
            <h3 className="text-xl font-bold text-white">SplitIt</h3>
            <p className="mt-4 text-sm">
              Your go-to app for fair expense splitting with reminders, group
              support, and seamless tracking.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-3 text-white">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#features" className="hover:text-white">
                  Features
                </a>
              </li>
              <li>
                <a href="#howitworks" className="hover:text-white">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-white">
                  Reviews
                </a>
              </li>
              <li>
                <a href="#download" className="hover:text-white">
                  Download
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-3 text-white">
              Contact Us
            </h4>
            <ul className="text-sm space-y-2">
              <li>Email: support@splitit.app</li>
              <li>Phone: +91 98765 43210</li>
              <li>Address: DTU Campus, Delhi, India</li>
            </ul>
          </div>

          {/* Socials / Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-3 text-white">
              Stay Connected
            </h4>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="hover:text-white">
                <i className="fab fa-facebook"></i> Facebook
              </a>
              <a href="#" className="hover:text-white">
                <i className="fab fa-instagram"></i> Instagram
              </a>
              <a href="#" className="hover:text-white">
                <i className="fab fa-linkedin"></i> LinkedIn
              </a>
            </div>

            {/* Optional: Newsletter */}
            <form className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="px-3 py-2 rounded-md bg-gray-800 border border-gray-600 text-white placeholder-gray-400 text-sm"
              />
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-2 rounded-md">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <hr className="my-6 border-gray-700" />
        <p className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} SplitIt. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
