import { useState, useEffect } from "react";
import "./App.css";

const API_URL = "https://op-spring-2026-pm-technical-workshop.onrender.com";

// Logo Component
function Logo() {
  return (
    <div className="logo">
      <img
        src={process.env.PUBLIC_URL + "/op_logo.png"}
        alt="Open Project Logo"
        className="logo-img"
      />
    </div>
  );
}

// Status Badge Component
function StatusBadge({ status }) {
  const isAvailable = status === "Available";
  return (
    <span
      className={`status-badge ${isAvailable ? "available" : "unavailable"}`}
    >
      {status}
    </span>
  );
}

// Category Badge Component
function CategoryBadge({ category }) {
  const isHardware = category === "Hardware";
  return (
    <span className={`category-badge ${isHardware ? "hardware" : "software"}`}>
      {category}
    </span>
  );
}

// Source Badge Component (manual/vision/import)
function SourceBadge({ source }) {
  const sourceClass = source || "manual";
  return (
    <span className={`source-badge ${sourceClass}`}>
      {source === "vision"
        ? "Vision"
        : source === "import"
        ? "Import"
        : "Manual"}
    </span>
  );
}

// Review Badge Component (needs review flag)
function ReviewBadge({ verified }) {
  if (verified !== false) return null;
  return <span className="review-badge">⚠️ Needs Review</span>;
}

// Format last seen date
function formatLastSeen(date) {
  if (!date) return null;
  const d = new Date(date);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString();
}

// Table View Component
function InventoryTable({ items }) {
  return (
    <div className="table-container">
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Source</th>
            <th>Last Seen</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className={item.verified === false ? "needs-review" : ""}
            >
              <td className="item-name">
                {item.name}
                <ReviewBadge verified={item.verified} />
              </td>
              <td>
                <CategoryBadge category={item.category} />
              </td>
              <td className="quantity">{item.quantity}</td>
              <td>
                <StatusBadge status={item.status} />
              </td>
              <td>
                <SourceBadge source={item.source} />
              </td>
              <td className="last-seen">
                {item.lastSeenAt ? (
                  <div className="last-seen-info">
                    <span className="last-seen-time">
                      {formatLastSeen(item.lastSeenAt)}
                    </span>
                    {item.lastSeenConfidence && (
                      <span className="confidence">
                        {Math.round(item.lastSeenConfidence * 100)}%
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-muted">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Card View Component
function InventoryCard({ item }) {
  return (
    <div
      className={`inventory-card ${
        item.verified === false ? "needs-review" : ""
      }`}
    >
      <div className="card-header">
        <h3 className="card-title">
          {item.name}
          <ReviewBadge verified={item.verified} />
        </h3>
        <CategoryBadge category={item.category} />
      </div>
      <div className="card-body">
        <div className="card-quantity">
          <span className="label">Quantity</span>
          <span className="value">{item.quantity}</span>
        </div>
        <StatusBadge status={item.status} />
      </div>
      <div className="card-footer">
        <SourceBadge source={item.source} />
        {item.lastSeenAt && (
          <div className="last-seen-info">
            <span className="last-seen-time">
              {formatLastSeen(item.lastSeenAt)}
            </span>
            {item.lastSeenConfidence && (
              <span className="confidence">
                {Math.round(item.lastSeenConfidence * 100)}%
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Cards Grid Component
function InventoryCards({ items }) {
  return (
    <div className="cards-grid">
      {items.map((item) => (
        <InventoryCard key={item.id} item={item} />
      ))}
    </div>
  );
}

// Add Item Form Component
function AddItemForm({ onItemAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "Hardware",
    quantity: 1,
    status: "Available",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/inventory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to add item");

      // Reset form
      setFormData({
        name: "",
        category: "Hardware",
        quantity: 1,
        status: "Available",
      });
      // Notify parent to refresh inventory
      onItemAdded();
    } catch (err) {
      alert("Error adding item: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="add-item-form" onSubmit={handleSubmit}>
      <h3>Add New Item</h3>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="Hardware">Hardware</option>
            <option value="Software">Software</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="quantity">Quantity</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="0"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
          </select>
        </div>
        <button type="submit" className="submit-btn" disabled={submitting}>
          {submitting ? "Adding..." : "Add Item"}
        </button>
      </div>
    </form>
  );
}

// View Toggle Component
function ViewToggle({ view, onToggle }) {
  return (
    <div className="view-toggle">
      <button
        className={`toggle-btn ${view === "table" ? "active" : ""}`}
        onClick={() => onToggle("table")}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 3h18v18H3V3zm2 2v4h6V5H5zm8 0v4h6V5h-6zm6 6h-6v4h6v-4zm0 6h-6v4h6v-4zm-8 4v-4H5v4h6zm-6-6h6v-4H5v4z" />
        </svg>
        Table
      </button>
      <button
        className={`toggle-btn ${view === "cards" ? "active" : ""}`}
        onClick={() => onToggle("cards")}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4 5h6v6H4V5zm0 8h6v6H4v-6zm8-8h6v6h-6V5zm0 8h6v6h-6v-6z" />
        </svg>
        Cards
      </button>
    </div>
  );
}

// Main App Component
function App() {
  const [view, setView] = useState("table");
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Reusable function to fetch inventory
  const fetchInventory = async () => {
    try {
      const res = await fetch(`${API_URL}/inventory`);
      if (!res.ok) throw new Error("Failed to fetch inventory");
      const data = await res.json();
      setInventory(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch inventory on mount
  useEffect(() => {
    fetchInventory();
  }, []);

  if (loading) {
    return (
      <div className="app">
        <p>Loading inventory...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <Logo />
        <div className="header-content">
          <h1 className="title">Inventory Dashboard</h1>
          <p className="subtitle">Manage Open Project resources</p>
        </div>
      </header>

      <main className="main">
        <AddItemForm onItemAdded={fetchInventory} />

        <div className="controls">
          <div className="stats">
            <div className="stat">
              <span className="stat-value">{inventory.length}</span>
              <span className="stat-label">Total Items</span>
            </div>
            <div className="stat">
              <span className="stat-value">
                {inventory.filter((i) => i.status === "Available").length}
              </span>
              <span className="stat-label">Available</span>
            </div>
            <div className="stat">
              <span className="stat-value stat-vision">
                {inventory.filter((i) => i.source === "vision").length}
              </span>
              <span className="stat-label">Vision Detected</span>
            </div>
            <div className="stat">
              <span
                className={`stat-value ${
                  inventory.filter((i) => i.verified === false).length > 0
                    ? "stat-warning"
                    : ""
                }`}
              >
                {inventory.filter((i) => i.verified === false).length}
              </span>
              <span className="stat-label">Needs Review</span>
            </div>
          </div>
          <ViewToggle view={view} onToggle={setView} />
        </div>

        {view === "table" ? (
          <InventoryTable items={inventory} />
        ) : (
          <InventoryCards items={inventory} />
        )}
      </main>

      <footer className="footer">
        <p>Open Project Inventory System</p>
      </footer>
    </div>
  );
}

export default App;
