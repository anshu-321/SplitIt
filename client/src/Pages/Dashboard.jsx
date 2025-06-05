import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import { data, Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../UserContext";
import axios from "axios";
import CategoryPieChart from "../Components/PiChart";

const Dashboard = () => {
  const navigate = useNavigate();
  const { id, name, username, url } = useContext(UserContext);
  const [userGroups, setUserGroups] = useState(undefined);
  const [dataToSend, setDataToSend] = useState([]);
  const [summaryFromAI, setSummaryFromAI] = useState("");
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
        const res = await axios.get(url + `/groups/user/${username}`, {
          withCredentials: true,
        });
        setUserGroups(res.data);
        // console.log("User Groups:", res.data, typeof res.data);
      } catch (err) {
        console.error("Error fetching groups:", err);
      }
    };

    const fetchSpends = async () => {
      if (username === undefined || username === null) {
        console.error("Username is undefined or null, cannot fetch spends.");
        return;
      }
      try {
        const res = await axios.get(
          url + "/transactions/user/" + username + "/categories",
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
    // if (summaryFromAI === "") handleAIOverview();
  }, [username]);

  if (dataToSend.length > 0) {
    dataToSend.sort((a, b) => b.totalAmount - a.totalAmount);
  }

  function handleEditClick(groupId) {
    navigate(`/group/${groupId}/edit`);
  }

  const handleGroupDelete = async (groupId) => {
    try {
      await axios.delete(url + "/group/" + groupId + "/delete", {
        withCredentials: true,
      });
      setUserGroups((prevGroups) =>
        prevGroups.filter((group) => group_id !== groupId)
      );
      alert("Group deleted successfully!");
      navigate("/login");
    } catch (err) {
      console.error("Error deleting group:", err);
      alert("Failed to delete group. Please try again.");
    }
  };

  const handleAIOverview = async () => {
    try {
      const res = await axios.get(url + "/gemini/" + username, {
        withCredentials: true,
      });
      setSummaryFromAI(res.data.data);
      console.log("AI Overview:", res.data.data);
    } catch (err) {
      console.error("Error fetching AI overview:", err);
      alert("Failed to fetch AI overview. Please try again.");
    }
  };

  return (
    <div className="bg-amber-600 min-h-screen bg-repeat">
      <Header />
      <div className="pt-32"></div>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-4 px-6 pb-4 pt-6 max-w-6xl mx-auto">
        <CategoryPieChart data={dataToSend} />
        <div className="font-bold text-3xl px-6 py-4 bg-white rounded-lg shadow-md">
          <h1 className="pb-2">Expenses by Category</h1>
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
        <div className="max-w-6xl mx-auto flex flex-col items-center px-6 pb-4 pt-6">
          <div className="w-full bg-gradient-to-r from-violet-700 to-violet-500 rounded-2xl shadow-lg p-8 mb-6 flex flex-col items-center">
            <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight drop-shadow">
              Gemini Summary
            </h1>
            <p className="text-xl text-indigo-100 mb-2">
              Welcome,{" "}
              <span className="font-semibold">{name ? name : "User"}</span>!
            </p>
            {summaryFromAI && (
              <div className="mt-4 w-full bg-white/80 rounded-lg p-4 shadow-inner">
                <p className="text-base text-gray-800 text-center">
                  {summaryFromAI}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center max-w-6xl mx-auto bg-white rounded-lg shadow-md px-6 py-4">
          <div className="font-bold text-2xl">Your Groups</div>
          <Link to="/group" className="cursor-pointer text-3xl font-bold">
            +
          </Link>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-6 pb-8 mt-8">
          {userGroups && userGroups.length > 0 ? (
            [...userGroups]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((group) => (
                <div>
                  <Link
                    to={`/group/${group._id}`}
                    key={group._id}
                    className="group w-full h-56 bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between border border-gray-100 hover:shadow-2xl hover:border-indigo-400 transition-all duration-300"
                  >
                    <div className="relative">
                      <h2 className="text-2xl font-bold text-indigo-700 group-hover:text-indigo-900 transition">
                        {group.name}
                      </h2>
                      <p className="text-gray-500 mt-2 mb-4 line-clamp-2">
                        {group.description}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-xs text-gray-500">
                        <span className="font-semibold text-gray-700">
                          Members:
                        </span>{" "}
                        {group.members.slice(0, 3).join(", ")}
                        {group.members.length > 3 && (
                          <span className="text-gray-400">
                            {" "}
                            +{group.members.length - 3} more
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-400">
                        <span className="font-semibold text-gray-600">
                          Created by:
                        </span>{" "}
                        {group.createdBy}
                      </p>
                    </div>
                  </Link>
                  <div className="flex ">
                    <div
                      className=" bg-cyan-600 p-2 rounded-lg cursor-pointer shadow-2xl w-full flex justify-center items-center"
                      onClick={() => handleEditClick(group._id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                    </div>
                    <div
                      className="w-full bg-red-600 p-2 rounded-lg cursor-pointer shadow-2xl flex justify-center items-center"
                      onClick={() => handleGroupDelete(group._id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <div className="w-full flex justify-center items-center col-span-full py-12">
              <p className="text-gray-400 text-lg">No groups found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
