import axios from "axios";
import React, { useContext, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../Components/Header";
import { UserContext } from "../UserContext";
import CategoryPieChart from "../Components/PiChart";

const GroupExpensePage = () => {
  const { username, url } = useContext(UserContext);
  const { groupId } = useParams();
  const [group, setGroup] = React.useState(null);
  const [error, setError] = React.useState("");
  const [transactions, setTransactions] = React.useState([]);
  const [debts, setDebts] = React.useState([]);
  const [isActive, setIsActive] = React.useState(true);
  const [dataToSend, setDataToSend] = React.useState([]);
  const navigate = useNavigate();

  const fetchDebts = async () => {
    try {
      const res = await axios.get(url + "/debts/group/" + groupId, {
        withCredentials: true,
      });
      const userOwes = res.data.filter((debt) => debt.to === username);
      setDebts(userOwes);
      console.log("Fetched debts:", userOwes);
    } catch (err) {
      console.error("Error fetching debts:", err);
      setError("Failed to fetch debts.");
    }
  };

  function clearDebt(debtId) {
    axios
      .patch(url + `/debts/${debtId}/complete`, {}, { withCredentials: true })
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
        const res = await axios.get(url + `/group/${groupId}`, {
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
        const res = await axios.get(url + "/transactions/group/" + groupId, {
          withCredentials: true,
        });
        setTransactions(res.data);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Failed to fetch transactions.");
      }
    };

    const fetchGroupTransactionsCategories = async () => {
      try {
        const res = await axios.get(
          url + "/transactions/" + groupId + "/categories",
          { withCredentials: true }
        );
        setDataToSend(res.data);
      } catch (err) {
        console.error("Error fetching transactions categories:", err);
        setError("Failed to fetch transactions categories.");
      }
    };

    fetchGroupMembers();
    fetchGroupTransactions();
    fetchGroupTransactionsCategories();
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

  function handleEditClick(groupId, transactionId) {
    navigate(`/group/${groupId}/transaction/${transactionId}/edit`);
  }

  const handleTransactionDelete = async (transactionId) => {
    try {
      await axios.delete(url + "/transaction/" + transactionId + "/delete", {
        withCredentials: true,
      });
      alert("Expense deleted successfully.");
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to delete Expense:", err);
      setError("Failed to delete Expense.");
    }
  };

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
          <CategoryPieChart data={dataToSend} />
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
                  <div key={transaction._id}>
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg shadow-sm">
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
                            ? new Date(
                                transaction.createdAt
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "N/A"}
                        </span>
                      </p>
                    </div>
                    <div className="flex ">
                      <div
                        className=" bg-cyan-600 p-2 rounded-lg cursor-pointer shadow-2xl w-full flex justify-center items-center"
                        onClick={() =>
                          handleEditClick(group._id, transaction._id)
                        }
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
                        onClick={() => handleTransactionDelete(transaction._id)}
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
                    <span className="font-medium">you </span> ₹
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
              No debts to show. You are all clear!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupExpensePage;
