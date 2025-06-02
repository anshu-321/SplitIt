import axios from "axios";
import React, { useContext, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../Components/Header";
import { UserContext } from "../UserContext";

const GroupExpensePage = () => {
  const { username } = useContext(UserContext);
  const { groupId } = useParams();
  const [group, setGroup] = React.useState(null);
  const [error, setError] = React.useState("");
  const [transactions, setTransactions] = React.useState([]);
  const [debts, setDebts] = React.useState([]);
  const [isActive, setIsActive] = React.useState(true);

  const fetchDebts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/debts/group/" + groupId,
        {
          withCredentials: true,
        }
      );
      setDebts(res.data);
    } catch (err) {
      console.error("Error fetching debts:", err);
      setError("Failed to fetch debts.");
    }
  };

  function clearDebt(debtId) {
    axios
      .patch(
        `http://localhost:4000/debts/${debtId}/complete`,
        {},
        { withCredentials: true }
      )
      .then(() => {
        fetchDebts();
      })
      .catch((err) => {
        console.error("Failed to complete debt:", err);
        setError("Failed to complete debt.");
      });
  }

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

  useEffect(() => {
    fetchDebts();
  }, [transactions]);

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
        <div className="mt-6 bg-blue-950 rounded-lg px-6 py-8">
          <h2 className="text-3xl font-bold text-white mb-4">Group Debts</h2>
          <div className="text-white mb-4 flex gap-8">
            <span
              className={
                "font-medium p-2 rounded-lg text-black cursor-pointer " +
                (isActive ? "bg-green-200" : "bg-white")
              }
              onClick={() => setIsActive(true)}
            >
              Active Debts
            </span>
            <span
              className={
                "font-medium p-2 rounded-lg text-black cursor-pointer " +
                (!isActive ? "bg-green-200" : "bg-white")
              }
              onClick={() => setIsActive(false)}
            >
              Completed Debts
            </span>
          </div>

          {debts.length > 0 ? (
            debts
              .filter(
                (debt) => debt.tag === (isActive ? "active" : "completed")
              )
              .map((debt) => (
                <div
                  key={debt._id}
                  className="mb-4 p-4 bg-blue-50 text-blue-800 rounded-lg shadow-sm flex justify-between items-center"
                >
                  <p>
                    <span className="font-medium">{debt.from}</span> owes{" "}
                    <span className="font-medium">{debt.to}</span> ₹
                    {debt.amount.toFixed(2)}
                  </p>

                  <div
                    className="cursor-pointer text-green-500"
                    onClick={() => clearDebt(debt._id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm3 10.5a.75.75 0 0 0 0-1.5H9a.75.75 0 0 0 0 1.5h6Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              ))
          ) : (
            <div className="text-white italic">
              No debts recorded yet. Keep track of your expenses!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupExpensePage;
