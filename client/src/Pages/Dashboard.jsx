import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../UserContext";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const { id, name, username } = useContext(UserContext);
  const [userGroups, setUserGroups] = useState(undefined);
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
    fetchGroups();
  }, [username]);

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

        <div className="w-full flex mx-auto overflow-x-auto gap-6 px-4 pb-4 snap-x snap-mandatory scroll-smooth mt-6">
          {userGroups && userGroups.length > 0 ? (
            userGroups.map((group) => (
              <div
                key={group._id}
                className="w-48 h-48 bg-white rounded-lg shadow-md p-6 snap-start flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
              >
                <div>
                  <h2 className="text-xl font-bold ">{group.name}</h2>
                  <p className="text-gray-600 mb-4">{group.description}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    Members : {group.members.join(", ").slice(0, 3)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Created by: {group.createdBy}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full flex justify-center items-center">
              <p className="text-gray-600">No groups found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
{
  /* <div className="w-48 h-48 mx-auto mt-6 bg-white rounded-lg shadow-md p-6">
          //   <h2 className="text-xl font-bold mb-4">Your Expenses</h2>
          //   <p className="text-gray-600">No expenses recorded yet.</p>
          // </div> */
}
