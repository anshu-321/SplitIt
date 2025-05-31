const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const User = require("./models/User");
const jwt = require("jsonwebtoken");
const Group = require("./models/Group");

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

const server = app.listen(4000);
