const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();
const prisma = new PrismaClient();

router.post("/register", async (req, res) => {
  const { fullName, birthday, email, password, role } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        fullName,
        birthday: new Date(birthday),
        email,
        password: hashedPassword,
        role: role || "user",
        status: "ACTIVE",
      },
    });
    res.status(201).json({ id: user.id, email: user.email });
  } catch (err) {
    res.status(400).json({ error: "User already exists or invalid data" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ userId: user.id, role: user.role }, "SECRET_KEY");
  res.json({ token });
});

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send("No token");

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, "SECRET_KEY");
    req.user = payload;
    next();
  } catch {
    res.status(401).send("Invalid token");
  }
}

router.get("/user/:id", authMiddleware, async (req, res) => {
  const id = Number(req.params.id);
  const requester = req.user;

  if (requester.role !== "admin" && requester.userId !== id) {
    return res.status(403).send("Forbidden");
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return res.status(404).send("User not found");

  res.json(user);
});

router.get("/users", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).send("Forbidden");

  const users = await prisma.user.findMany();
  res.json(users);
});

router.post("/user/:id/block", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const requester = req.user;

  if (requester.role !== "admin" && requester.userId !== id) {
    return res.status(403).send("Forbidden");
  }

  const user = await prisma.user.update({
    where: { id },
    data: { status: "INACTIVE" },
  });
  res.json(user);
});

module.exports = router;
