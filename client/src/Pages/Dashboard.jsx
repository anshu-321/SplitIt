import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import { data, Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../UserContext";
import axios from "axios";
import CategoryPieChart from "../Components/PiChart";

const Dashboard = () => {
  const navigate = useNavigate();
  const { id, name, username } = useContext(UserContext);
  const [userGroups, setUserGroups] = useState(undefined);
  const [dataToSend, setDataToSend] = useState([]);
  useEffect(() => {
    if (id === undefined || id === null) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const fetchGroups = async () => {
      if (!username || username === "") {
        // console.log("No username found, skipping group fetch.");
        return;
      }
      try {
        // console.log("Fetching groups for user:", username);
        const res = await axios.get(
          `http://localhost:4000/groups/user/${username}`,
          {
            withCredentials: true,
          }
        );
        setUserGroups(res.data);
        // console.log("User Groups:", res.data, typeof res.data);
      } catch (err) {
        console.error("Error fetching groups:", err);
      }
    };

    const fetchSpends = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/transactions/user/" + username + "/categories",
          {
            withCredentials: true,
          }
        );
        setDataToSend(res.data);
      } catch (err) {
        console.error("Error fetching spends:", err);
      }
    };

    fetchGroups();
    fetchSpends();
  }, [username]);

  if (dataToSend.length > 0) {
    dataToSend.sort((a, b) => b.totalAmount - a.totalAmount);
    // console.log("Data to send:", dataToSend);
  }

  return (
    <div className="bg-amber-600 min-h-screen bg-repeat">
      <Header />
      <div className="pt-32"></div>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-4 px-6 pb-4 pt-6 max-w-6xl mx-auto">
        <CategoryPieChart data={dataToSend} />
        <div className="font-bold text-3xl px-6 py-4 bg-white rounded-lg shadow-md">
          Expenses by Category
          {dataToSend.length > 0 ? (
            dataToSend.map((item) => (
              <div key={item.category} className="text-lg text-gray-700 my-2">
                {item.category}: ₹{item.totalAmount.toFixed(2)}
              </div>
            ))
          ) : (
            <div className="text-gray-600">No expenses found.</div>
          )}
        </div>
      </div>

      <div className="h-screen bg-amber-600 px-6 w-max-4xl mx-auto">
        <div className="max-w-6xl mx-auto flex flex-col px-6 pb-4 pt-6">
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

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6 pb-4 scroll-smooth mt-6">
          {userGroups && userGroups.length > 0 ? (
            userGroups.map((group) => (
              <Link
                to={"/group/" + group._id}
                key={group._id}
                className="w-full h-48 bg-white rounded-lg shadow-md p-6 snap-start flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
              >
                <div>
                  <h2 className="text-xl font-bold ">{group.name}</h2>
                  <p className="text-gray-600 mb-4">{group.description}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    Members : {group.members.slice(0, 3).join(", ")}
                  </p>
                  <p className="text-sm text-gray-500">
                    Created by: {group.createdBy}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <div className="w-full flex justify-center items-center col-span-full">
              <p className="text-gray-600">No groups found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
