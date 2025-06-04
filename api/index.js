const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const User = require("./models/User");
const jwt = require("jsonwebtoken");
const Group = require("./models/Group");
const Transaction = require("./models/Transaction");
const Debt = require("./models/Debt");
const GoogleGenAI = require("@google/genai").GoogleGenAI;

dotenv.config();
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));
const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

function checkAuth(req, res) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });
  });
}

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const findUser = await User.findOne({ username });
    if (findUser) {
      const passMatch = bcrypt.compareSync(password, findUser.password);
      if (passMatch) {
        jwt.sign(
          { userId: findUser._id, username, name: findUser.name },
          jwtSecret,
          {},
          (err, token) => {
            if (err) throw err;
            res.cookie("token", token).json({
              id: findUser._id,
              username: findUser.username,
              name: findUser.name,
            });
          }
        );
      }
    }
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/register", async (req, res) => {
  const { name, username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
    const createdUser = await User.create({
      name: name,
      username: username,
      password: hashedPassword,
    });

    jwt.sign(
      { userId: createdUser._id, username, name: createdUser.name },
      jwtSecret,
      {},
      (err, token) => {
        if (err) throw err;
        res.cookie("token", token).status(201).json({
          id: createdUser._id,
          name: createdUser.name,
          username: createdUser.username,
        });
      }
    );
  } catch (err) {
    if (err) throw err;
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/profile", (req, res) => {
  const token = req.cookies?.token;
  if (token) {
    jwt.verify(token, jwtSecret, {}, (err, userData) => {
      if (err) throw err;
      res.json(userData);
    });
  } else {
    res.json("No token");
  }
});

app.get("/test", (req, res) => {
  res.json("Hello World");
});

//----------------CREATING GROUP ------------------
//checking if the username exists in the User Database
app.get("/check-username/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const exists = await User.exists({ username });
    res.json({ exists: !!exists });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//creating a group and checking if the group already exists
app.post("/create-group", async (req, res) => {
  const { name, description, status, members, createdBy } = req.body;

  try {
    const existingGroup = await Group.findOne({ name, createdBy });
    if (existingGroup) {
      return res
        .status(400)
        .json({ message: "Group with this name already exists" });
    }

    const group = await Group.create({
      name,
      description,
      status,
      members,
      createdBy,
    });
    res.status(201).json({ message: "Group created successfully", group });
  } catch (err) {
    console.error("Error creating group:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Updating the group based on groupId
app.patch("/group/:groupId/update", async (req, res) => {
  checkAuth(req, res);
  const { groupId } = req.params;
  const updateFields = req.body;

  try {
    const updatedGroup = await Group.findByIdAndUpdate(groupId, updateFields, {
      new: true,
    });
    if (!updatedGroup) {
      return res.status(404).json({ message: "Group not found" });
    }
    res.json({ message: "Group updated successfully", group: updatedGroup });
  } catch (err) {
    console.error("Error updating group:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// - ---------------- FETCHING THE GROUPS BASED ON USERNAME -------------------
app.get("/groups/user/:username", async (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });

    const { username } = req.params;

    if (username !== userData.username) {
      return res.status(403).json({ message: "Forbidden" });
    }

    try {
      const groups = await Group.find({ members: username });
      res.json(groups);
    } catch (err) {
      console.log("Error fetching groups for given user:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
});

// - ---------------- FETCHING THE GROUPS BASED ON GROUP ID -------------------
app.get("/group/:groupId", async (req, res) => {
  checkAuth(req, res);

  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    res.json(group);
    // console.log("Group fetched successfully:", group);
  } catch (err) {
    console.error("Error fetching group by ID:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETING A GROUP ----
app.delete("/group/:groupId/delete", async (req, res) => {
  checkAuth(req, res);
  const { groupId } = req.params;
  try {
    const deletedGroup = await Group.findByIdAndDelete(groupId);
    if (!deletedGroup) {
      return res.status(404).json({ message: "Group not found" });
    }
    // delete all transactions and debts associated with this group
    await Transaction.deleteMany({ groupId }); //deleteMany deleted the groups based on groupId
    await Debt.deleteMany({ groupId });
    res.json({ message: "Group deleted successfully" });
  } catch (err) {
    console.error("Error deleting group:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//------------------ CREATING A TRANSACTION AND MAINTING THE DEBTS-------------------
app.post("/create-transaction", async (req, res) => {
  checkAuth(req, res);
  const { groupId, paidBy, amount, description, splitBetween, category } =
    req.body;
  try {
    const newTransaction = await Transaction.create({
      groupId,
      paidBy,
      amount,
      description,
      splitBetween,
      category,
    });
    // Updating the group Debt's
    const to = paidBy;
    splitBetween.forEach(async (from) => {
      if (from !== to) {
        await Debt.create({
          groupId,
          from,
          to,
          amount: amount / splitBetween.length,
          tag: "active",
          transactionId: newTransaction._id,
        });
      }
    });

    res.status(201).json(newTransaction);
  } catch (err) {
    console.error("Error creating transaction:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//getting all transactions for a specific group
app.get("/transactions/group/:groupId", async (req, res) => {
  checkAuth(req, res);
  const { groupId } = req.params;
  try {
    const transactions = await Transaction.find({ groupId });
    res.json(transactions);
    // console.log("Transactions fetched successfully:", transactions);
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

const server = app.listen(4000);

//FETCHING A TRANSACTION BY ID
app.get("/transaction/:transactionId", async (req, res) => {
  checkAuth(req, res);
  const { transactionId } = req.params;
  try {
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.json(transaction);
  } catch (err) {
    console.error("Error fetching transaction by ID:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//UPDATING A TRANSACTION
app.patch("/transaction/:transactionId/edit", async (req, res) => {
  checkAuth(req, res);
  const { transactionId } = req.params;
  const updatedFields = req.body;
  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      transactionId,
      updatedFields,
      { new: true } // Return the updated document
    );
    if (!updatedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    //deleting existing debts for this transaction
    await Debt.deleteMany({ transactionId }); // Delete existing debts for this transaction
    const { groupId, paidBy, amount, splitBetween } = updatedFields;
    const to = paidBy;
    splitBetween.forEach(async (from) => {
      if (from !== to) {
        await Debt.create({
          groupId,
          from,
          to,
          amount: amount / splitBetween.length,
          tag: "active",
          transactionId: updatedTransaction._id,
        });
      }
    });

    res.json({
      message: "Transaction updated successfully",
      transaction: updatedTransaction,
    });
  } catch (err) {
    console.error("Error updating transaction:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//------------------ DELETING A TRANSACTION -------------------
app.delete("/transaction/:transactionId/delete", async (req, res) => {
  checkAuth(req, res);
  const { transactionId } = req.params;
  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(
      transactionId
    );
    if (!deletedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    await Debt.deleteMany({ transactionId }); // Delete all debts associated with this transaction
    res.json({ message: "Transaction deleted successfully" });
  } catch (err) {
    console.error("Error deleting transaction:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//------------------ DEBTS -------------------
app.get("/debts/group/:groupId", async (req, res) => {
  checkAuth(req, res);
  const { groupId } = req.params;
  try {
    const debts = await Debt.find({ groupId });
    res.json(debts);
  } catch (err) {
    console.error("Error fetching debts:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.patch("/debts/:debtId/complete", async (req, res) => {
  checkAuth(req, res);
  const { debtId } = req.params;
  try {
    const updatedDebt = await Debt.findByIdAndUpdate(
      debtId,
      { tag: "completed" },
      { new: true }
    );
    if (!updatedDebt) {
      return res.status(404).json({ message: "Debt not found" });
    }
    res.json(updatedDebt);
  } catch (err) {
    console.error("Error completing debt:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// -------------------FETCHING THE SUM OF SPENDS FOR A USER IN A CATEGORY -------------

app.get("/transactions/user/:username/categories", async (req, res) => {
  checkAuth(req, res);
  const { username } = req.params;
  try {
    const transactions = await Transaction.aggregate([
      { $match: { splitBetween: username } }, // only includes transaction where user is involved

      // Add a field to calculate user share
      {
        $addFields: {
          userShare: {
            $divide: ["$amount", { $size: "$splitBetween" }],
          },
        },
      },

      // Group by category and sum the user share
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$userShare" },
        },
      },

      // Project the result to include category and total amount
      {
        $project: {
          category: "$_id",
          totalAmount: 1,
          _id: 0,
        },
      },
    ]);
    res.json(transactions);
  } catch (err) {
    console.error("Error fetching category spends:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// -------------------FETCHING THE SUM OF SPENDS FOR A GROUP -------------
app.get("/transactions/:groupId/categories", async (req, res) => {
  checkAuth(req, res);
  const { groupId } = req.params;
  const groupObjectId = new mongoose.Types.ObjectId(groupId);
  try {
    const transactions = await Transaction.aggregate([
      { $match: { groupId: groupObjectId } }, // only includes transaction where groupId is involved

      // Group by category and sum the user share
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
        },
      },

      // Project the result to include category and total amount
      {
        $project: {
          category: "$_id",
          totalAmount: 1,
          _id: 0,
        },
      },
    ]);
    res.json(transactions);
  } catch (err) {
    console.error("Error fetching category spends:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// -------------------LOGOUT -------------------
app.post("/logout", (req, res) => {
  checkAuth(req, res);
  res.clearCookie("token"); // Clear the cookie
  res.json("Logged out successfully");
});

// -------------------GEMINI API -------------------

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function GeminiFunction(userDebt, userTransaction, username) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [
      {
        text: `You are a financial assistant. Based on the following debts, provide a summary of the user's financial situation:\n\n DO NOT GIVE NEXT STEPS , KEEP THE ANSWER MEDIUM , AND TRY TO GIVE SUGGESTIONS BASED ON ESSENTIAL AND NON ESSENTIAL SPENDS , KEEP THE SYMBOL OF CURRENCY AS INDIAN RUPEES RATHER THAN DOLLARS , AND BEGIN NATURALLY AND IN RESULT DO NOT BREAK LINES AND EXPAND IF POSSIBLE AND PREVENT USING END OF LINE SYMBOL THE DEBTS DATA , AND USERNAME IS ${username} AND USE THIS DEBT TABLE TO MAKE CONCLUSIONS AS TO WHAT IS YET TO BE RECEIVED BY THE USER AND IS OWED BY THE USER ${userDebt
          .map(
            (debt) =>
              `Debt from ${debt.from} to ${debt.to} of amount ${debt.amount} with tag ${debt.tag}`
          )
          .join("\n")}  AND THE USER DATA IS AS FOLLOWS ${userTransaction.map(
          (transaction) => {
            ` Paid By: ${transaction.paidBy}, Amount: ${
              transaction.amount
            }, Description: ${
              transaction.description
            }, Split Between: ${transaction.splitBetween.join(
              ", "
            )}, Category: ${transaction.category}`;
          }
        )}  MENTION INFO FROM THE DEBTS AND TRANSACTIONS AND GIVE A SUMMARY OF THE USER'S FINANCIAL SITUATION SUGGESTING ESSENTIAL AND NON-ESSENTIAL SPENDS. MENTION ONLY WHAT IS OWED BY THE USER`,
      },
    ],
  });
  return response.text;
}

app.get("/gemini/:username", async (req, res) => {
  checkAuth(req, res);
  const { username } = req.params;
  try {
    const resp = await Debt.find({ to: req.params.username, tag: "active" });
    const userTransaction = await Transaction.find({
      splitBetween: username,
      paidBy: username,
    });
    const GeminiRes = await GeminiFunction(resp, userTransaction, username);
    // console.log("Gemini Response:", GeminiRes);
    res.json({ message: "Gemini API called successfully", data: GeminiRes });
  } catch (err) {
    console.error("Error in Gemini API:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});
