const dotenv = require("dotenv");
dotenv.config(); // 🔥 Load .env FIRST

const express = require("express");
const session = require("express-session");
const passport = require("passport");

const authRoutes = require("./routes/authRoutes");
const sequelize = require("./config/db");

require("./utils/passport"); // ✅ Load this AFTER dotenv

const app = express();
app.use(express.json());

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);

sequelize.sync().then(() => {
  console.log("✅ Database synced");
  app.listen(process.env.PORT || 3000, () => console.log(`Server running on port ${process.env.PORT || 3000}`));
}).catch(err => console.error("❌ DB connection error:", err));
