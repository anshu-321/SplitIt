import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import axios from "axios";
import Header from "../Components/Header";

const CreateTransaction = () => {
  const { groupId, transactionId } = useParams();
  const { user } = useContext(UserContext);
  const [groupMembers, setGroupMembers] = useState([]);
  const [paidBy, setPaidBy] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [splitBetween, setSplitBetween] = useState([]);
  const navigate = useNavigate();
  const [category, setCategory] = useState("Miscellaneous");

  const categories = [
    "Food & Dining",
    "Entertainment",
    "Travel",
    "Party/Events",
    "Gifts",
    "Groceries",
    "Utilities",
    "Rent",
    "Household Supplies",
    "Cleaning Services",
    "Medical",
    "Education",
    "Transportation",
    "Miscellaneous",
  ];

  const isEdit = transactionId !== undefined && transactionId !== null;

  useEffect(() => {
    // Fetch group details to get member list
    const fetchGroup = async () => {
      const res = await axios.get(`http://localhost:4000/group/${groupId}`, {
        withCredentials: true,
      });
      setGroupMembers(res.data.members);
    };

    const fetchTransaction = async () => {
      if (isEdit) {
        const res = await axios.get(
          `http://localhost:4000/transaction/${transactionId}`,
          { withCredentials: true }
        );
        const transaction = res.data;
        setPaidBy(transaction.paidBy);
        setAmount(transaction.amount.toString());
        setDescription(transaction.description);
        setSplitBetween(transaction.splitBetween || []);
        setCategory(transaction.category || "Miscellaneous");
      }
    };

    fetchTransaction();
    fetchGroup();
  }, [groupId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!paidBy || !amount || !description || splitBetween.length === 0) {
      alert("Please fill all fields.");
      return;
    }

    if (isEdit && !transactionId) {
      alert("Transaction ID is required for editing.");
      return;
    }

    if (isEdit) {
      try {
        await axios.patch(
          "http://localhost:4000/transaction/" + transactionId + "/edit",
          {
            groupId,
            paidBy,
            amount: parseFloat(amount),
            description,
            splitBetween,
            category,
          },
          { withCredentials: true }
        );
      } catch (err) {
        console.error("Transaction update failed:", err);
        return;
      }
      navigate(`/group/${groupId}`);
    } else {
      try {
        await axios.post(
          `http://localhost:4000/create-transaction`,
          {
            groupId,
            paidBy,
            amount: parseFloat(amount),
            description,
            splitBetween,
            category,
          },
          { withCredentials: true }
        );
        navigate(`/group/${groupId}`);
        console.log("Transaction created successfully");
      } catch (err) {
        console.error("Transaction creation failed:", err);
      }
    }
  };

  return (
    <div className="bg-amber-600 min-h-screen bg-repeat flex items-center justify-center">
      <Header />
      <div className="max-w-md w-full px-6 py-10 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Add Transaction</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor="block">Description:</label>
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <label htmlFor="block">Amount:</label>
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <label className="block">Paid By:</label>
          <select
            className="w-full p-2 border rounded"
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
          >
            <option value="">Select Paid By</option>
            {groupMembers.map((member) => (
              <option key={member} value={member}>
                {member}
              </option>
            ))}
          </select>

          <label className="block">Category:</label>
          <select
            className="w-full p-2 border rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((member) => (
              <option key={member} value={member}>
                {member}
              </option>
            ))}
          </select>

          <label className="block">Split Between:</label>
          <div className="flex flex-col space-y-1">
            {groupMembers.map((member) => (
              <label key={member} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={member}
                  checked={splitBetween.includes(member)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSplitBetween([...splitBetween, member]);
                    } else {
                      setSplitBetween(splitBetween.filter((p) => p !== member));
                    }
                  }}
                />
                <span>{member}</span>
              </label>
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {isEdit ? "Update" : "Add Transaction"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTransaction;
