import express, { response } from "express";
import mysql from "mysql";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt, { hash } from "bcrypt";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import morgan from "morgan";
import predictRoute from "../routes/PredictRoute.js";
import evaluationRoute from "../routes/EvaluationRoute.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const salt = 10;
const jwtSecret = process.env.JWT_SECRET || 'jwt-secret-key';

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["POST", "GET"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(morgan("dev"));

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "user_auth",
});

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ Error: "You are not authenticated" });
  } else {
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        return res.json({ Error: "Token is not ok" });
      } else {
        req.name = decoded.name;
        next();
      }
    });
  }
};

app.get("/is-logged-in", verifyUser, (req, res) => {
  return res.json({ Status: "Success", name: req.name });
});

app.post("/register", (req, res) => {
  const sql = "INSERT INTO login (`name`,`email`,`password`) VALUES (?)";
  bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
    if (err) return res.json({ Error: "Error for hashing password" });
    const values = [req.body.name, req.body.email, hash];
    db.query(sql, [values], (err, result) => {
      if (err) return res.json({ Error: "Interesting data Error in Server" });
      return res.json({ Status: "Success" });
    });
  });
});

app.post("/login", (req, res) => {
  const sql = "SELECT * FROM login WHERE email = ?";
  db.query(sql, [req.body.email], (err, data) => {
    if (err) return res.json({ Error: "Loggin error in Server" });
    if (data.length > 0) {
      bcrypt.compare(
        req.body.password.toString(),
        data[0].password,
        (err, response) => {
          if (err) return res.json({ Error: "Password compare error" });
          if (response) {
            const name = data[0].name;
            const token = jwt.sign({ name }, jwtSecret, {
              expiresIn: "1d",
            });
            res.cookie("token", token);
            return res.json({ Status: "Success" });
          } else {
            return res.json({ Error: "Password not matched" });
          }
        }
      );
    } else {
      return res.json({ Error: "No Email Existed" });
    }
  });
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: "Success" });
});

// Mount ML prediction routes
app.use("/api", predictRoute);
// Mount ML evaluation results route
app.use("/api", evaluationRoute);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Serve React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, '../..', 'frontend', 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../..', 'frontend', 'dist', 'index.html'));
  });
}

app.listen(process.env.PORT || 8081, () => {
  console.log(`Server running on port ${process.env.PORT || 8081}`);
});




