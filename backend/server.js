require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());            // lets your frontend call this backend
app.use(express.json());    // parses JSON request bodies

// ============================================
// IN-MEMORY STORAGE (commented out for reference)
// ============================================
// let inventory = [
//   { id: 1, name: "Arduino Kit", category: "Hardware", quantity: 5, status: "Available" },
//   { id: 2, name: "Figma License", category: "Software", quantity: 20, status: "Available" },
//   { id: 3, name: "Raspberry Pi 4", category: "Hardware", quantity: 3, status: "Available" },
//   { id: 4, name: "Adobe Creative Suite", category: "Software", quantity: 10, status: "Unavailable" },
//   { id: 5, name: "Soldering Station", category: "Hardware", quantity: 2, status: "Available" },
//   { id: 6, name: "GitHub Copilot License", category: "Software", quantity: 15, status: "Available" },
// ];

// // Helper to generate next ID
// function getNextId(items) {
//   return items.length ? Math.max(...items.map(i => i.id)) + 1 : 1;
// }

// // GET /inventory -> return all items (in-memory)
// app.get("/inventory", (req, res) => {
//   res.json(inventory);
// });

// // POST /inventory -> add new item (in-memory)
// app.post("/inventory", (req, res) => {
//   const { name, category, quantity, status } = req.body;
//   if (!name || !category || typeof quantity !== "number" || !status) {
//     return res.status(400).json({
//       message: "Invalid body. Required: name, category, quantity (number), status",
//     });
//   }
//   const newItem = {
//     id: getNextId(inventory),
//     name,
//     category,
//     quantity,
//     status,
//   };
//   inventory.push(newItem);
//   res.status(201).json({ message: "item added successfully", item: newItem });
// });
// ============================================

// ============================================
// MONGODB STORAGE
// ============================================

// Mongoose Schema & Model
const inventorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  status: { type: String, required: true },
  // ML support fields
  source: { type: String, enum: ["manual", "vision", "import"], default: "manual" },
  verified: { type: Boolean, default: true },
  // Optional dashboard-friendly fields
  lastSeenAt: { type: Date },
  lastSeenConfidence: { type: Number },
});

const Item = mongoose.model("Item", inventorySchema);

// GET /inventory -> return all items from MongoDB
app.get("/inventory", async (req, res) => {
  try {
    const items = await Item.find();
    // Map _id to id for frontend compatibility
    const result = items.map(item => ({
      id: item._id,
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      status: item.status,
      source: item.source,
      verified: item.verified,
      lastSeenAt: item.lastSeenAt,
      lastSeenConfidence: item.lastSeenConfidence,
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Error fetching inventory", error: err.message });
  }
});

// POST /inventory -> add new item to MongoDB
app.post("/inventory", async (req, res) => {
  const { name, category, quantity, status } = req.body;

  // Basic validation
  if (!name || !category || typeof quantity !== "number" || !status) {
    return res.status(400).json({
      message: "Invalid body. Required: name, category, quantity (number), status",
    });
  }

  try {
    const newItem = new Item({ name, category, quantity, status });
    await newItem.save();
    res.status(201).json({ message: "item added successfully", item: newItem });
  } catch (err) {
    res.status(500).json({ message: "Error adding item", error: err.message });
  }
});

// Connect to MongoDB then start server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
