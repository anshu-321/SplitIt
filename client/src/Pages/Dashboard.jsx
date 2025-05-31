import React, { useEffect } from "react";
import Header from "../Components/Header";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../UserContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { id, name } = useContext(UserContext);
  useEffect(() => {
    if (id === undefined || id === null) {
      navigate("/login");
    }
  }, []);

  return (
    <div>
      <Header />
      <div className="h-screen bg-amber-600 p-6">
        <div className="max-w-6xl mx-auto pt-24 pb-6">
          <h1 className="text-3xl font-bold text-white mb-4">Dashboard</h1>
          <p className="text-lg text-white">
            Welcome, {name ? name : "User"}! This is your dashboard.
          </p>
          <p className="text-lg text-white mt-2">
            Here you can manage your expenses and view your financial insights.
          </p>
        </div>

        <div className="flex justify-between items-center max-w-6xl mx-auto bg-white rounded-lg shadow-md px-6 py-4">
          <div className="font-bold text-2xl">Your Groups</div>
          <Link to="/group" className="cursor-pointer text-3xl font-bold">
            +
          </Link>
        </div>

        <div className="w-full flex mx-auto overflow-x-auto gap-6 px-4 pb-4 snap-x snap-mandatory scroll-smooth">
          <div className="w-48 h-48 mx-auto mt-6 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Your Expenses</h2>
            <p className="text-gray-600">No expenses recorded yet.</p>
          </div>
          <div className="w-48 h-48 mx-auto mt-6 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Your Expenses</h2>
            <p className="text-gray-600">No expenses recorded yet.</p>
          </div>
          <div className="w-48 h-48 mx-auto mt-6 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Your Expenses</h2>
            <p className="text-gray-600">No expenses recorded yet.</p>
          </div>
          <div className="w-48 h-48 mx-auto mt-6 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Your Expenses</h2>
            <p className="text-gray-600">No expenses recorded yet.</p>
          </div>
          <div className="w-48 h-48 mx-auto mt-6 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Your Expenses</h2>
            <p className="text-gray-600">No expenses recorded yet.</p>
          </div>
          <div className="w-48 h-48 mx-auto mt-6 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Your Expenses</h2>
            <p className="text-gray-600">No expenses recorded yet.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
