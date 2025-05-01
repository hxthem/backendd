const dotenv = require("dotenv");
dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET is not defined in the environment variables.");
  process.exit(1);
}

if (!process.env.PORT) {
  console.warn("⚠️ PORT is not defined. Using default port 3000.");
}
const searchRoutes = require('./routes/searchRoutes');
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const winston = require("winston");
const authRoutes = require("./routes/authRoutes");
const skillRoutes = require('./routes/skillRoutes');
const sequelize = require("./config/db");
require("./utils/passport");
const userRoutes = require('./routes/userRoutes');

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "error.log", level: "error" })
  ]
});

const app = express();

app.use(express.json());

app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  credentials: true
}));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later."
});

app.use("/api/", apiLimiter);

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/user', userRoutes);

// Database Sync
sequelize.sync({ alter: true })
  .then(() => {
    logger.info("✅ Database synced");
    const server = app.listen(process.env.PORT || 3000, () => {
      logger.info(`🚀 Server running on port ${process.env.PORT || 3000}`);
    });

    process.on("SIGTERM", () => {
      logger.info("SIGTERM received. Closing server...");
      server.close(() => {
        logger.info("Server closed.");
        sequelize.close().then(() => {
          logger.info("Database connection closed.");
          process.exit(0);
        });
      });
    });
  })
  .catch(err => {
    logger.error("❌ Error syncing database:", err);
    process.exit(1);
  });

// Error Handling Middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

app.use('/api/search', searchRoutes);

const requestRoutes = require("./routes/requestRoutes");
app.use("/api/request", requestRoutes);
