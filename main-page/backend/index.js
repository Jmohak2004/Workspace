// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Connect MongoDB
mongoose
  .connect("mongodb+srv://sangantiaryanwork_db_user:Aryan150306@test.gffxare.mongodb.net/MainPage?")
  .then(() => console.log(" MongoDB Connected"))
  .catch((err) => console.log(" MongoDB Error:", err));

// ✅ User Model
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});
const User = mongoose.model("User", userSchema);

// ✅ POST /api/users - login or register
app.post("/users", async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email)
    return res.status(400).json({ message: "Name and email required" });

  let user = await User.findOne({ email });
  if (!user) {
    user = new User({ name, email });
    await user.save();
    return res.status(201).json({ message: "User registered", user });
  }

  res.json({ message: "User logged in", user });
});

const PORT = 5050;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
