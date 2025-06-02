import axios from "axios";
import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../Components/Header";

const GroupExpensePage = () => {
  const { groupId } = useParams();
  const [group, setGroup] = React.useState(null);
  const [error, setError] = React.useState("");
  const [transactions, setTransactions] = React.useState([]);
  useEffect(() => {
    const fetchGroupMembers = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/group/${groupId}`, {
          withCredentials: true,
        });
        setGroup(res.data);
      } catch (err) {
        setError("Failed to fetch group details.");
        console.error(err);
      }
    };

    const fetchGroupTransactions = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/transactions/group/" + groupId,
          { withCredentials: true }
        );
        setTransactions(res.data);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Failed to fetch transactions.");
      }
    };

    fetchGroupMembers();
    fetchGroupTransactions();
  }, [groupId]);
  if (error)
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!group) return <div className="text-center mt-10">Loading...</div>;
  let totalSpends = 0;
  if (transactions.length > 0) {
    transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    totalSpends = transactions.reduce((sumAmount, transaction) => {
      return sumAmount + Number(transaction.amount);
    }, 0);
  }
  return (
    <div className="bg-amber-600 min-h-screen bg-repeat">
      <Header />
      <div className="mt-22 max-w-5xl mx-auto p-6">
        <div className="bg-white shadow-xl rounded-2xl p-8">
          <div className="mb-6 border-b pb-4">
            <h1 className="text-3xl font-bold text-indigo-600 mb-2">
              {group.name}
            </h1>
            <h1 className="text-3xl font-bold text-indigo-400 mb-2">
              Total Spends: ₹{totalSpends}
            </h1>
            <p className="text-gray-700 text-lg">{group.description}</p>
            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <span>
                Status:{" "}
                <span className="font-medium text-black">{group.status}</span>
              </span>
              <span>
                Created by:{" "}
                <span className="font-medium text-black">
                  {group.createdBy}
                </span>
              </span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Members
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {group.members.map((member) => (
                <div
                  key={member}
                  className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg shadow-sm text-center"
                >
                  {member}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center max-w-6xl mx-auto bg-white rounded-lg shadow-md px-6 py-4 mb-6">
              <div className="text-2xl font-semibold">Group Transactions</div>
              <Link
                to={"/group/" + groupId + "/transaction"}
                className="cursor-pointer text-3xl font-bold"
              >
                +
              </Link>
            </div>
            {transactions.length > 0 ? (
              transactions.map((transaction) => {
                return (
                  <div
                    key={transaction._id}
                    className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm"
                  >
                    <h3 className="text-lg font-semibold text-gray-800">
                      {transaction.description}
                    </h3>
                    <p className="text-gray-600">
                      Category:{" "}
                      <span className="font-medium text-black">
                        {transaction.category}
                      </span>
                    </p>
                    <p className="text-gray-600">
                      Amount:{" "}
                      <span className="font-medium text-black">
                        ₹{transaction.amount.toFixed(2)}
                      </span>
                    </p>
                    <p className="text-gray-600">
                      Paid by:{" "}
                      <span className="font-medium text-black">
                        {transaction.paidBy}
                      </span>
                    </p>
                    <p className="text-gray-600">
                      Split between:{" "}
                      <span className="font-medium text-black">
                        {transaction.splitBetween.join(", ")}
                      </span>
                    </p>
                    <p className="text-gray-600">
                      At:{" "}
                      <span className="font-medium text-black">
                        {transaction.createdAt
                          ? new Date(transaction.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )
                          : "N/A"}
                      </span>
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="text-gray-500 italic">
                No transactions yet. Coming soon...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupExpensePage;
