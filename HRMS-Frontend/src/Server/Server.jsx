const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const DB_PATH = path.join(__dirname, "db.json");
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-later";
const TOKEN_TTL = "2h";

function readDB() {
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}

function sign(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      company: user.company,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: TOKEN_TTL }
  );
}

function auth(req, res, next) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Missing token" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Invalid/Expired token" });
  }
}

app.post("/auth/Login", (req, res) => {
  const { email, password } = req.body;
  const { users } = readDB();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const token = sign(user);
  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company
    }
  });
});

app.get("/auth/me", auth, (req, res) => {
  const { users } = readDB();
  const user = users.find(u => u.id === req.user.sub);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    company: user.company
  });
});

// Example protected employee data (self or allowed by role)
app.get("/employees/:userId", auth, (req, res) => {
  const { employees, users } = readDB();
  const targetId = Number(req.params.userId);
  const targetUser = users.find(u => u.id === targetId);
  if (!targetUser) return res.status(404).json({ message: "Not found" });

  const sameCompany = req.user.company === targetUser.company;

  const allowed =
    req.user.sub === targetId || // self
    (req.user.role === "manager" && sameCompany) ||
    (req.user.role === "admin" && sameCompany);

  if (!allowed) return res.status(403).json({ message: "Forbidden" });

  const data = employees.find(e => e.userId === targetId) || {
    userId: targetId,
    profile: {},
    payslips: []
  };
  res.json(data);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("Auth API on http://localhost:" + PORT));
