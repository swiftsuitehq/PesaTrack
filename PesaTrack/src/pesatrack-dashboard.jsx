import React, { useState, useMemo } from "react";
import {
  LayoutDashboard, ShoppingCart, Receipt, BarChart3, Settings, Plus, X, Menu,
  TrendingUp, TrendingDown, Smartphone, ArrowUpRight, ArrowDownRight, Wallet, Banknote, CreditCard,
  Search, Pencil, Trash2, Calendar, Hash, Download, Tag, Building2, MapPin, Phone, Mail, Sun, Moon, RotateCcw, Check
} from "lucide-react";
import { AreaChart, Area, BarChart, Bar, Legend, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const INK = "#132A22";
const EMERALD = "#0F6B4C";
const EMERALD_DEEP = "#0B4E38";
const GOLD = "#C89B3C";
const BRICK = "#A63D40";
const BG = "#F6F7F5";
const SURFACE = "#FFFFFF";
const BORDER = "#E4E7E3";
const TEXT_DIM = "#6B7A72";

const FONTS = (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;600&display=swap');
    .f-display { font-family: 'Sora', sans-serif; }
    .f-body { font-family: 'Inter', sans-serif; }
    .f-mono { font-family: 'JetBrains Mono', monospace; font-variant-numeric: tabular-nums; }
  `}</style>
);

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "sales", label: "Sales", icon: ShoppingCart },
  { id: "expenses", label: "Expenses", icon: Receipt },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

function isoDate(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

const INITIAL_TRANSACTIONS = [
  { id: 1, date: isoDate(0), time: "09:12 AM", desc: "Retail sale — assorted groceries", category: "Retail Sale", method: "M-Pesa", amount: 2450, type: "sale" },
  { id: 2, date: isoDate(0), time: "09:40 AM", desc: "Stock delivery — cooking oil", category: "Stock", method: "Cash", amount: 6200, type: "expense" },
  { id: 3, date: isoDate(0), time: "10:05 AM", desc: "Retail sale — beverages", category: "Retail Sale", method: "Cash", amount: 1180, type: "sale" },
  { id: 4, date: isoDate(0), time: "10:47 AM", desc: "Wholesale order — restaurant supply", category: "Wholesale", method: "M-Pesa", amount: 14300, type: "sale" },
  { id: 5, date: isoDate(0), time: "11:20 AM", desc: "Electricity token", category: "Utilities", method: "M-Pesa", amount: 1500, type: "expense" },
  { id: 6, date: isoDate(0), time: "12:15 PM", desc: "Retail sale — household items", category: "Retail Sale", method: "Card", amount: 3200, type: "sale" },
  { id: 7, date: isoDate(0), time: "01:02 PM", desc: "Staff lunch allowance", category: "Staff", method: "Cash", amount: 800, type: "expense" },
  { id: 8, date: isoDate(0), time: "01:48 PM", desc: "Retail sale — assorted items", category: "Retail Sale", method: "M-Pesa", amount: 4120, type: "sale" },
  { id: 9, date: isoDate(0), time: "02:30 PM", desc: "Delivery rider fee", category: "Logistics", method: "M-Pesa", amount: 350, type: "expense" },
  { id: 10, date: isoDate(0), time: "03:15 PM", desc: "Wholesale order — cafe supply", category: "Wholesale", method: "M-Pesa", amount: 8900, type: "sale" },
  { id: 11, date: isoDate(1), time: "10:20 AM", desc: "Retail sale — beverages", category: "Retail Sale", method: "M-Pesa", amount: 1950, type: "sale" },
  { id: 12, date: isoDate(1), time: "02:05 PM", desc: "Wholesale order — hotel supply", category: "Wholesale", method: "Cash", amount: 11200, type: "sale" },
  { id: 13, date: isoDate(1), time: "04:30 PM", desc: "Service — delivery arrangement", category: "Service", method: "Card", amount: 2600, type: "sale" },
];
const STORAGE_KEY = "pesatrack_transactions";

function loadTransactions() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  } catch {
    return INITIAL_TRANSACTIONS;
  }
}

const WEEKLY_TREND = [
  { day: "Mon", sales: 32400 },
  { day: "Tue", sales: 28900 },
  { day: "Wed", sales: 41200 },
  { day: "Thu", sales: 35700 },
  { day: "Fri", sales: 46800 },
  { day: "Sat", sales: 52300 },
  { day: "Today", sales: 48250 },
];

const CATEGORIES = ["Retail Sale", "Wholesale", "Service", "Other"];
const EXPENSE_CATEGORIES = ["Stock", "Utilities", "Staff", "Logistics", "Rent", "Other"];
const METHODS = ["M-Pesa", "Cash", "Card"];

function fmt(n) {
  return `KSh ${Math.round(n).toLocaleString("en-KE")}`;
}

function MethodIcon({ method, size = 13 }) {
  if (method === "M-Pesa") return <Smartphone size={size} />;
  if (method === "Card") return <CreditCard size={size} />;
  return <Banknote size={size} />;
}

function StatCard({ label, value, delta, positive, icon: Icon, accent }) {
  return (
    <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "20px 22px", flex: "1 1 220px", minWidth: 200 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <span className="f-body" style={{ fontSize: 13, color: TEXT_DIM, fontWeight: 500 }}>{label}</span>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: `${accent}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={16} color={accent} />
        </div>
      </div>
      <div className="f-mono" style={{ fontSize: 24, fontWeight: 600, color: INK, marginBottom: 8 }}>{value}</div>
      {delta !== undefined && (
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12.5, color: positive ? EMERALD : BRICK }}>
          {positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          <span className="f-mono">{delta}</span>
          <span style={{ color: TEXT_DIM }}>vs yesterday</span>
        </div>
      )}
    </div>
  );
}

function Sidebar({ active, setActive, mobileOpen, setMobileOpen }) {
  return (
    <>
      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 30 }} className="md:hidden" />
      )}
      <div
        className={`fixed md:static top-0 left-0 h-full md:h-auto z-40 transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        style={{
          width: 240, background: EMERALD_DEEP, position: "relative", overflow: "hidden",
          minHeight: "100vh", display: "flex", flexDirection: "column", flexShrink: 0,
        }}
      >
        <SidebarTexture />
        <div style={{ position: "relative", zIndex: 1, padding: "26px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: GOLD, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Wallet size={17} color={EMERALD_DEEP} />
            </div>
            <span className="f-display" style={{ fontSize: 18, fontWeight: 700, color: "#F4F2EC" }}>PesaTrack</span>
          </div>
        </div>
        <nav style={{ position: "relative", zIndex: 1, padding: "8px 12px", display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActive(item.id); setMobileOpen(false); }}
                className="f-body"
                style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 10,
                  background: isActive ? "rgba(244,242,236,0.12)" : "transparent",
                  border: "none", cursor: "pointer", textAlign: "left",
                  color: isActive ? "#F4F2EC" : "rgba(244,242,236,0.6)",
                  fontSize: 14.5, fontWeight: 500,
                  borderLeft: isActive ? `3px solid ${GOLD}` : "3px solid transparent",
                }}
              >
                <item.icon size={17} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div style={{ position: "relative", zIndex: 1, padding: "18px 20px", borderTop: "1px solid rgba(244,242,236,0.1)" }}>
          <div style={{ fontSize: 12, color: "rgba(244,242,236,0.45)" }} className="f-body">Kibanda Fresh Grocers</div>
          <div style={{ fontSize: 11.5, color: "rgba(244,242,236,0.3)" }} className="f-body">Nairobi, Kenya</div>
        </div>
      </div>
    </>
  );
}

function SidebarTexture() {
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 0.5, pointerEvents: "none" }}>
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="guilloche" width="46" height="46" patternUnits="userSpaceOnUse">
            <circle cx="23" cy="23" r="20" fill="none" stroke="rgba(244,242,236,0.05)" strokeWidth="1" />
            <circle cx="23" cy="23" r="12" fill="none" stroke="rgba(244,242,236,0.05)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#guilloche)" />
      </svg>
    </div>
  );
}

function AddSaleModal({ open, onClose, onSave, editingSale }) {
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [method, setMethod] = useState(METHODS[0]);

  React.useEffect(() => {
    if (open) {
      if (editingSale) {
        setDesc(editingSale.desc);
        setAmount(String(editingSale.amount));
        setCategory(editingSale.category);
        setMethod(editingSale.method);
      } else {
        setDesc(""); setAmount(""); setCategory(CATEGORIES[0]); setMethod(METHODS[0]);
      }
    }
  }, [open, editingSale]);

  if (!open) return null;
  const isEdit = !!editingSale;

  function submit() {
    if (!desc.trim() || !amount || isNaN(Number(amount))) return;
    onSave({ desc, amount: Number(amount), category, method }, editingSale?.id ?? null);
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(19,42,34,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 16 }}>
      <div style={{ background: SURFACE, borderRadius: 18, padding: 26, maxWidth: 400, width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <span className="f-display" style={{ fontSize: 18, fontWeight: 700, color: INK }}>{isEdit ? "Edit Sale" : "Add Sale"}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: TEXT_DIM }}><X size={20} /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={labelStyle}>Description</label>
            <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="e.g. Retail sale — beverages" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Amount (KSh)</label>
            <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" type="number" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Payment Method</label>
            <div style={{ display: "flex", gap: 8 }}>
              {METHODS.map((m) => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className="f-body"
                  style={{
                    flex: 1, padding: "10px 0", borderRadius: 10, cursor: "pointer",
                    border: method === m ? `1.5px solid ${EMERALD}` : `1.5px solid ${BORDER}`,
                    background: method === m ? `${EMERALD}0D` : SURFACE,
                    color: method === m ? EMERALD : TEXT_DIM, fontSize: 13, fontWeight: 500,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  }}
                >
                  <MethodIcon method={m} /> {m}
                </button>
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={submit}
          className="f-display"
          style={{ marginTop: 22, width: "100%", background: EMERALD, color: "#fff", border: "none", padding: "13px", borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: "pointer" }}
        >
          {isEdit ? "Save Changes" : "Add Sale"}
        </button>
      </div>
    </div>
  );
}

const labelStyle = { display: "block", fontSize: 12.5, color: TEXT_DIM, marginBottom: 6, fontFamily: "'Inter', sans-serif", fontWeight: 500 };
const inputStyle = {
  width: "100%", border: `1.5px solid ${BORDER}`, borderRadius: 10, padding: "11px 12px",
  fontSize: 14.5, color: INK, fontFamily: "'Inter', sans-serif", outline: "none", boxSizing: "border-box", background: SURFACE,
};

function AddExpenseModal({ open, onClose, onSave, editingExpense }) {
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [method, setMethod] = useState(METHODS[0]);

  React.useEffect(() => {
    if (open) {
      if (editingExpense) {
        setDesc(editingExpense.desc);
        setAmount(String(editingExpense.amount));
        setCategory(editingExpense.category);
        setMethod(editingExpense.method);
      } else {
        setDesc(""); setAmount(""); setCategory(EXPENSE_CATEGORIES[0]); setMethod(METHODS[0]);
      }
    }
  }, [open, editingExpense]);

  if (!open) return null;
  const isEdit = !!editingExpense;

  function submit() {
    if (!desc.trim() || !amount || isNaN(Number(amount))) return;
    onSave({ desc, amount: Number(amount), category, method }, editingExpense?.id ?? null);
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(19,42,34,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 16 }}>
      <div style={{ background: SURFACE, borderRadius: 18, padding: 26, maxWidth: 400, width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <span className="f-display" style={{ fontSize: 18, fontWeight: 700, color: INK }}>{isEdit ? "Edit Expense" : "Add Expense"}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: TEXT_DIM }}><X size={20} /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={labelStyle}>Description</label>
            <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="e.g. Stock delivery — cooking oil" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Amount (KSh)</label>
            <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" type="number" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Expense Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
              {EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Payment Method</label>
            <div style={{ display: "flex", gap: 8 }}>
              {METHODS.map((m) => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className="f-body"
                  style={{
                    flex: 1, padding: "10px 0", borderRadius: 10, cursor: "pointer",
                    border: method === m ? `1.5px solid ${BRICK}` : `1.5px solid ${BORDER}`,
                    background: method === m ? `${BRICK}0D` : SURFACE,
                    color: method === m ? BRICK : TEXT_DIM, fontSize: 13, fontWeight: 500,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  }}
                >
                  <MethodIcon method={m} /> {m}
                </button>
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={submit}
          className="f-display"
          style={{ marginTop: 22, width: "100%", background: BRICK, color: "#fff", border: "none", padding: "13px", borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: "pointer" }}
        >
          {isEdit ? "Save Changes" : "Add Expense"}
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [transactions, setTransactions] = useState(loadTransactions);
  
  React.useEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}, [transactions]);

  const [mpesaBalance, setMpesaBalance] = useState(156780);

  const todaySales = useMemo(() => transactions.filter((t) => t.type === "sale" && t.date === isoDate(0)).reduce((s, t) => s + t.amount, 0), [transactions]);
  const todayExpenses = useMemo(() => transactions.filter((t) => t.type === "expense" && t.date === isoDate(0)).reduce((s, t) => s + t.amount, 0), [transactions]);
  const todayProfit = todaySales - todayExpenses;

  const trendData = useMemo(() => {
    const copy = [...WEEKLY_TREND];
    copy[copy.length - 1] = { ...copy[copy.length - 1], sales: todaySales };
    return copy;
  }, [todaySales]);

  function openAddModal() {
    setEditingSale(null);
    setModalOpen(true);
  }

  function openEditModal(sale) {
    setEditingSale(sale);
    setModalOpen(true);
  }

  function saveSale({ desc, amount, category, method }, id) {
    if (id == null) {
      // Add new sale
      const now = new Date();
      const time = now.toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" });
      setTransactions((prev) => [{ id: Date.now(), date: isoDate(0), time, desc, category, method, amount, type: "sale" }, ...prev]);
      if (method === "M-Pesa") setMpesaBalance((b) => b + amount);
    } else {
      // Update existing sale
      setTransactions((prev) => prev.map((t) => {
        if (t.id !== id) return t;
        if (t.method === "M-Pesa") setMpesaBalance((b) => b - t.amount);
        if (method === "M-Pesa") setMpesaBalance((b) => b + amount);
        return { ...t, desc, category, method, amount };
      }));
    }
    setModalOpen(false);
    setEditingSale(null);
  }

  function deleteSale(id) {
    setTransactions((prev) => {
      const target = prev.find((t) => t.id === id);
      if (target?.method === "M-Pesa" && target.type === "sale") {
        setMpesaBalance((b) => b - target.amount);
      }
      return prev.filter((t) => t.id !== id);
    });
  }

  function openAddExpenseModal() {
    setEditingExpense(null);
    setExpenseModalOpen(true);
  }

  function openEditExpenseModal(expense) {
    setEditingExpense(expense);
    setExpenseModalOpen(true);
  }

  function saveExpense({ desc, amount, category, method }, id) {
    if (id == null) {
      // Add new expense
      const now = new Date();
      const time = now.toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" });
      setTransactions((prev) => [{ id: Date.now(), date: isoDate(0), time, desc, category, method, amount, type: "expense" }, ...prev]);
      if (method === "M-Pesa") setMpesaBalance((b) => b - amount);
    } else {
      // Update existing expense
      setTransactions((prev) => prev.map((t) => {
        if (t.id !== id) return t;
        if (t.method === "M-Pesa") setMpesaBalance((b) => b + t.amount);
        if (method === "M-Pesa") setMpesaBalance((b) => b - amount);
        return { ...t, desc, category, method, amount };
      }));
    }
    setExpenseModalOpen(false);
    setEditingExpense(null);
  }

  function deleteExpense(id) {
    setTransactions((prev) => {
      const target = prev.find((t) => t.id === id);
      if (target?.method === "M-Pesa" && target.type === "expense") {
        setMpesaBalance((b) => b + target.amount);
      }
      return prev.filter((t) => t.id !== id);
    });
  }

  return (
    <div className="f-body" style={{ minHeight: "100vh", background: BG, display: "flex" }}>
      {FONTS}
      <Sidebar active={active} setActive={setActive} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Top bar */}
        <div style={{ background: SURFACE, borderBottom: `1px solid ${BORDER}`, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button onClick={() => setMobileOpen(true)} className="md:hidden" style={{ background: "none", border: "none", cursor: "pointer", color: INK }}>
              <Menu size={22} />
            </button>
            <div>
              <div className="f-display" style={{ fontSize: 19, fontWeight: 700, color: INK, textTransform: "capitalize" }}>
                {active === "dashboard" ? "Dashboard" : active}
              </div>
              <div style={{ fontSize: 12.5, color: TEXT_DIM }}>
                {new Date().toLocaleDateString("en-KE", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </div>
            </div>
          </div>
          <button
            onClick={openAddModal}
            className="f-display"
            style={{
              display: "flex", alignItems: "center", gap: 8, background: EMERALD, color: "#fff", border: "none",
              padding: "11px 18px", borderRadius: 11, fontSize: 14, fontWeight: 600, cursor: "pointer",
              boxShadow: "0 6px 18px rgba(15,107,76,0.3)",
            }}
          >
            <Plus size={17} /> <span>Add Sale</span>
          </button>
        </div>

        <div style={{ padding: "24px" }}>
          {active === "sales" ? (
            <SalesPage
              transactions={transactions}
              onAddClick={openAddModal}
              onEdit={openEditModal}
              onDelete={deleteSale}
            />
          ) : active === "expenses" ? (
            <ExpensesPage
              transactions={transactions}
              onAddClick={openAddExpenseModal}
              onEdit={openEditExpenseModal}
              onDelete={deleteExpense}
            />
          ) : active === "reports" ? (
            <ReportsPage transactions={transactions} />
          ) : active !== "dashboard" ? (
            <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "60px 24px", textAlign: "center" }}>
              <div className="f-display" style={{ fontSize: 18, fontWeight: 600, color: INK, marginBottom: 6, textTransform: "capitalize" }}>{active}</div>
              <div style={{ fontSize: 14, color: TEXT_DIM }}>This section is coming soon.</div>
            </div>
          ) : (
            <>
              {/* Stat cards */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
                <StatCard label="Today's Sales" value={fmt(todaySales)} delta="+8.2%" positive icon={TrendingUp} accent={EMERALD} />
                <StatCard label="Today's Expenses" value={fmt(todayExpenses)} delta="+2.1%" positive={false} icon={TrendingDown} accent={BRICK} />
                <StatCard label="Today's Profit" value={fmt(todayProfit)} delta="+11.4%" positive icon={Wallet} accent={GOLD} />
                <StatCard label="M-Pesa Balance" value={fmt(mpesaBalance)} icon={Smartphone} accent="#2E5EAA" />
              </div>

              {/* Chart + table */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }} className="lg:grid-cols-5">
                <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "22px 20px" }} className="lg:col-span-3">
                  <div className="f-display" style={{ fontSize: 15.5, fontWeight: 600, color: INK, marginBottom: 4 }}>Sales Trend</div>
                  <div style={{ fontSize: 12.5, color: TEXT_DIM, marginBottom: 18 }}>Last 7 days</div>
                  <div style={{ width: "100%", height: 260 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendData} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
                        <defs>
                          <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={EMERALD} stopOpacity={0.35} />
                            <stop offset="100%" stopColor={EMERALD} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke={BORDER} vertical={false} />
                        <XAxis dataKey="day" tick={{ fontSize: 12, fill: TEXT_DIM, fontFamily: "Inter" }} axisLine={{ stroke: BORDER }} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: TEXT_DIM, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                        <Tooltip
                          formatter={(v) => [fmt(v), "Sales"]}
                          contentStyle={{ borderRadius: 10, border: `1px solid ${BORDER}`, fontFamily: "Inter", fontSize: 13 }}
                        />
                        <Area type="monotone" dataKey="sales" stroke={EMERALD} strokeWidth={2.5} fill="url(#salesGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "22px 20px" }} className="lg:col-span-2">
                  <div className="f-display" style={{ fontSize: 15.5, fontWeight: 600, color: INK, marginBottom: 4 }}>Payment Mix</div>
                  <div style={{ fontSize: 12.5, color: TEXT_DIM, marginBottom: 18 }}>Today's sales by method</div>
                  <PaymentMix transactions={transactions} />
                </div>
              </div>

              {/* Transactions table */}
              <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "22px 20px", marginTop: 16 }}>
                <div className="f-display" style={{ fontSize: 15.5, fontWeight: 600, color: INK, marginBottom: 16 }}>Recent Transactions</div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                        {["Time", "Description", "Category", "Method", "Amount"].map((h) => (
                          <th key={h} style={{ textAlign: h === "Amount" ? "right" : "left", padding: "0 8px 10px", fontSize: 12, color: TEXT_DIM, fontWeight: 500 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.slice(0, 8).map((t) => (
                        <tr key={t.id} style={{ borderBottom: `1px solid ${BORDER}` }}>
                          <td className="f-mono" style={{ padding: "12px 8px", fontSize: 12.5, color: TEXT_DIM, whiteSpace: "nowrap" }}>{t.time}</td>
                          <td style={{ padding: "12px 8px", fontSize: 13.5, color: INK }}>{t.desc}</td>
                          <td style={{ padding: "12px 8px", fontSize: 12.5, color: TEXT_DIM }}>{t.category}</td>
                          <td style={{ padding: "12px 8px", fontSize: 12.5 }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: TEXT_DIM }}>
                              <MethodIcon method={t.method} size={12} /> {t.method}
                            </span>
                          </td>
                          <td className="f-mono" style={{ padding: "12px 8px", fontSize: 13.5, fontWeight: 600, textAlign: "right", color: t.type === "sale" ? EMERALD : BRICK, whiteSpace: "nowrap" }}>
                            {t.type === "sale" ? "+" : "−"}{fmt(t.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <AddSaleModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingSale(null); }}
        onSave={saveSale}
        editingSale={editingSale}
      />
      <AddExpenseModal
        open={expenseModalOpen}
        onClose={() => { setExpenseModalOpen(false); setEditingExpense(null); }}
        onSave={saveExpense}
        editingExpense={editingExpense}
      />
    </div>
  );
}

function SalesPage({ transactions, onAddClick, onEdit, onDelete }) {
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const sales = useMemo(() => transactions.filter((t) => t.type === "sale"), [transactions]);

  const filtered = useMemo(() => {
    return sales.filter((t) => {
      const matchesSearch =
        !search.trim() ||
        t.desc.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase());
      const matchesMethod = methodFilter === "All" || t.method === methodFilter;
      const matchesDate = !dateFilter || t.date === dateFilter;
      return matchesSearch && matchesMethod && matchesDate;
    });
  }, [sales, search, methodFilter, dateFilter]);

  const totalSales = filtered.reduce((s, t) => s + t.amount, 0);
  const count = filtered.length;
  const avgSale = count ? totalSales / count : 0;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div className="f-display" style={{ fontSize: 22, fontWeight: 700, color: INK }}>Sales</div>
        <button
          onClick={onAddClick}
          className="f-display"
          style={{
            display: "flex", alignItems: "center", gap: 8, background: EMERALD, color: "#fff", border: "none",
            padding: "11px 18px", borderRadius: 11, fontSize: 14, fontWeight: 600, cursor: "pointer",
            boxShadow: "0 6px 18px rgba(15,107,76,0.3)",
          }}
        >
          <Plus size={17} /> Add Sale
        </button>
      </div>

      {/* Summary cards */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
        <StatCard label="Total Sales" value={fmt(totalSales)} icon={TrendingUp} accent={EMERALD} />
        <StatCard label="Number of Transactions" value={String(count)} icon={Hash} accent="#2E5EAA" />
        <StatCard label="Average Sale" value={fmt(avgSale)} icon={Wallet} accent={GOLD} />
      </div>

      {/* Filters */}
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "16px 18px", marginBottom: 16, display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
        <div style={{ position: "relative", flex: "2 1 220px", minWidth: 200 }}>
          <Search size={16} color={TEXT_DIM} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by description or category"
            style={{ ...inputStyle, paddingLeft: 36 }}
          />
        </div>

        <div style={{ display: "flex", gap: 6, flex: "1 1 260px" }}>
          {["All", ...METHODS].map((m) => (
            <button
              key={m}
              onClick={() => setMethodFilter(m)}
              className="f-body"
              style={{
                padding: "9px 13px", borderRadius: 9, cursor: "pointer", fontSize: 13, fontWeight: 500, whiteSpace: "nowrap",
                border: methodFilter === m ? `1.5px solid ${EMERALD}` : `1.5px solid ${BORDER}`,
                background: methodFilter === m ? `${EMERALD}0D` : SURFACE,
                color: methodFilter === m ? EMERALD : TEXT_DIM,
              }}
            >
              {m}
            </button>
          ))}
        </div>

        <div style={{ position: "relative", flex: "1 1 180px", minWidth: 160 }}>
          <Calendar size={15} color={TEXT_DIM} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{ ...inputStyle, paddingLeft: 36 }}
          />
        </div>
        {(search || methodFilter !== "All" || dateFilter) && (
          <button
            onClick={() => { setSearch(""); setMethodFilter("All"); setDateFilter(""); }}
            style={{ background: "none", border: "none", color: TEXT_DIM, fontSize: 13, cursor: "pointer", textDecoration: "underline" }}
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "22px 20px" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                {["Time", "Description", "Category", "Method", "Amount", "Actions"].map((h) => (
                  <th key={h} style={{ textAlign: h === "Amount" ? "right" : h === "Actions" ? "center" : "left", padding: "0 8px 10px", fontSize: 12, color: TEXT_DIM, fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: "36px 8px", textAlign: "center", fontSize: 13.5, color: TEXT_DIM }}>
                    No sales match these filters.
                  </td>
                </tr>
              )}
              {filtered.map((t) => (
                <tr key={t.id} style={{ borderBottom: `1px solid ${BORDER}` }}>
                  <td className="f-mono" style={{ padding: "12px 8px", fontSize: 12.5, color: TEXT_DIM, whiteSpace: "nowrap" }}>{t.time}</td>
                  <td style={{ padding: "12px 8px", fontSize: 13.5, color: INK }}>{t.desc}</td>
                  <td style={{ padding: "12px 8px", fontSize: 12.5, color: TEXT_DIM }}>{t.category}</td>
                  <td style={{ padding: "12px 8px", fontSize: 12.5 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: TEXT_DIM }}>
                      <MethodIcon method={t.method} size={12} /> {t.method}
                    </span>
                  </td>
                  <td className="f-mono" style={{ padding: "12px 8px", fontSize: 13.5, fontWeight: 600, textAlign: "right", color: EMERALD, whiteSpace: "nowrap" }}>
                    +{fmt(t.amount)}
                  </td>
                  <td style={{ padding: "12px 8px" }}>
                    <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                      <button
                        onClick={() => onEdit(t)}
                        title="Edit"
                        style={{ background: "none", border: `1px solid ${BORDER}`, borderRadius: 8, padding: 6, cursor: "pointer", color: TEXT_DIM, display: "flex" }}
                      >
                        <Pencil size={14} />
                      </button>
                      {confirmDeleteId === t.id ? (
                        <>
                          <button
                            onClick={() => { onDelete(t.id); setConfirmDeleteId(null); }}
                            className="f-body"
                            style={{ background: BRICK, border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", color: "#fff", fontSize: 12, fontWeight: 500 }}
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="f-body"
                            style={{ background: "none", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "6px 10px", cursor: "pointer", color: TEXT_DIM, fontSize: 12 }}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(t.id)}
                          title="Delete"
                          style={{ background: "none", border: `1px solid ${BORDER}`, borderRadius: 8, padding: 6, cursor: "pointer", color: BRICK, display: "flex" }}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ExpensesPage({ transactions, onAddClick, onEdit, onDelete }) {
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const expenses = useMemo(() => transactions.filter((t) => t.type === "expense"), [transactions]);

  const filtered = useMemo(() => {
    return expenses.filter((t) => {
      const matchesSearch =
        !search.trim() ||
        t.desc.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase());
      const matchesMethod = methodFilter === "All" || t.method === methodFilter;
      const matchesDate = !dateFilter || t.date === dateFilter;
      return matchesSearch && matchesMethod && matchesDate;
    });
  }, [expenses, search, methodFilter, dateFilter]);

  const totalExpenses = filtered.reduce((s, t) => s + t.amount, 0);
  const count = filtered.length;
  const avgExpense = count ? totalExpenses / count : 0;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div className="f-display" style={{ fontSize: 22, fontWeight: 700, color: INK }}>Expenses</div>
        <button
          onClick={onAddClick}
          className="f-display"
          style={{
            display: "flex", alignItems: "center", gap: 8, background: BRICK, color: "#fff", border: "none",
            padding: "11px 18px", borderRadius: 11, fontSize: 14, fontWeight: 600, cursor: "pointer",
            boxShadow: "0 6px 18px rgba(166,61,64,0.3)",
          }}
        >
          <Plus size={17} /> Add Expense
        </button>
      </div>

      {/* Summary cards */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
        <StatCard label="Total Expenses" value={fmt(totalExpenses)} icon={TrendingDown} accent={BRICK} />
        <StatCard label="Number of Expenses" value={String(count)} icon={Hash} accent="#2E5EAA" />
        <StatCard label="Average Expense" value={fmt(avgExpense)} icon={Wallet} accent={GOLD} />
      </div>

      {/* Filters */}
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "16px 18px", marginBottom: 16, display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
        <div style={{ position: "relative", flex: "2 1 220px", minWidth: 200 }}>
          <Search size={16} color={TEXT_DIM} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by description or category"
            style={{ ...inputStyle, paddingLeft: 36 }}
          />
        </div>

        <div style={{ display: "flex", gap: 6, flex: "1 1 260px" }}>
          {["All", ...METHODS].map((m) => (
            <button
              key={m}
              onClick={() => setMethodFilter(m)}
              className="f-body"
              style={{
                padding: "9px 13px", borderRadius: 9, cursor: "pointer", fontSize: 13, fontWeight: 500, whiteSpace: "nowrap",
                border: methodFilter === m ? `1.5px solid ${BRICK}` : `1.5px solid ${BORDER}`,
                background: methodFilter === m ? `${BRICK}0D` : SURFACE,
                color: methodFilter === m ? BRICK : TEXT_DIM,
              }}
            >
              {m}
            </button>
          ))}
        </div>

        <div style={{ position: "relative", flex: "1 1 180px", minWidth: 160 }}>
          <Calendar size={15} color={TEXT_DIM} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{ ...inputStyle, paddingLeft: 36 }}
          />
        </div>
        {(search || methodFilter !== "All" || dateFilter) && (
          <button
            onClick={() => { setSearch(""); setMethodFilter("All"); setDateFilter(""); }}
            style={{ background: "none", border: "none", color: TEXT_DIM, fontSize: 13, cursor: "pointer", textDecoration: "underline" }}
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "22px 20px" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                {["Time", "Description", "Category", "Method", "Amount", "Actions"].map((h) => (
                  <th key={h} style={{ textAlign: h === "Amount" ? "right" : h === "Actions" ? "center" : "left", padding: "0 8px 10px", fontSize: 12, color: TEXT_DIM, fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: "36px 8px", textAlign: "center", fontSize: 13.5, color: TEXT_DIM }}>
                    No expenses match these filters.
                  </td>
                </tr>
              )}
              {filtered.map((t) => (
                <tr key={t.id} style={{ borderBottom: `1px solid ${BORDER}` }}>
                  <td className="f-mono" style={{ padding: "12px 8px", fontSize: 12.5, color: TEXT_DIM, whiteSpace: "nowrap" }}>{t.time}</td>
                  <td style={{ padding: "12px 8px", fontSize: 13.5, color: INK }}>{t.desc}</td>
                  <td style={{ padding: "12px 8px", fontSize: 12.5, color: TEXT_DIM }}>{t.category}</td>
                  <td style={{ padding: "12px 8px", fontSize: 12.5 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: TEXT_DIM }}>
                      <MethodIcon method={t.method} size={12} /> {t.method}
                    </span>
                  </td>
                  <td className="f-mono" style={{ padding: "12px 8px", fontSize: 13.5, fontWeight: 600, textAlign: "right", color: BRICK, whiteSpace: "nowrap" }}>
                    −{fmt(t.amount)}
                  </td>
                  <td style={{ padding: "12px 8px" }}>
                    <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                      <button
                        onClick={() => onEdit(t)}
                        title="Edit"
                        style={{ background: "none", border: `1px solid ${BORDER}`, borderRadius: 8, padding: 6, cursor: "pointer", color: TEXT_DIM, display: "flex" }}
                      >
                        <Pencil size={14} />
                      </button>
                      {confirmDeleteId === t.id ? (
                        <>
                          <button
                            onClick={() => { onDelete(t.id); setConfirmDeleteId(null); }}
                            className="f-body"
                            style={{ background: BRICK, border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", color: "#fff", fontSize: 12, fontWeight: 500 }}
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="f-body"
                            style={{ background: "none", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "6px 10px", cursor: "pointer", color: TEXT_DIM, fontSize: 12 }}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(t.id)}
                          title="Delete"
                          style={{ background: "none", border: `1px solid ${BORDER}`, borderRadius: 8, padding: 6, cursor: "pointer", color: BRICK, display: "flex" }}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function toISO(d) {
  return d.toISOString().slice(0, 10);
}

function getRangeDates(rangeType, customStart, customEnd) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (rangeType === "today") {
    const iso = toISO(today);
    return { start: iso, end: iso };
  }
  if (rangeType === "week") {
    const day = today.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return { start: toISO(monday), end: toISO(sunday) };
  }
  if (rangeType === "month") {
    const first = new Date(today.getFullYear(), today.getMonth(), 1);
    const last = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return { start: toISO(first), end: toISO(last) };
  }
  return { start: customStart || toISO(today), end: customEnd || toISO(today) };
}

const RANGE_OPTIONS = [
  { id: "today", label: "Today" },
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" },
  { id: "custom", label: "Custom Range" },
];

function ReportsPage({ transactions }) {
  const [rangeType, setRangeType] = useState("today");
  const [customStart, setCustomStart] = useState(isoDate(0));
  const [customEnd, setCustomEnd] = useState(isoDate(0));

  const { start, end } = useMemo(
    () => getRangeDates(rangeType, customStart, customEnd),
    [rangeType, customStart, customEnd]
  );

  const filtered = useMemo(
    () => transactions.filter((t) => t.date >= start && t.date <= end),
    [transactions, start, end]
  );

  const sales = filtered.filter((t) => t.type === "sale");
  const expenses = filtered.filter((t) => t.type === "expense");
  const totalSales = sales.reduce((s, t) => s + t.amount, 0);
  const totalExpenses = expenses.reduce((s, t) => s + t.amount, 0);
  const netProfit = totalSales - totalExpenses;

  const chartData = useMemo(() => {
    const map = {};
    filtered.forEach((t) => {
      if (!map[t.date]) map[t.date] = { date: t.date, sales: 0, expenses: 0 };
      if (t.type === "sale") map[t.date].sales += t.amount;
      else map[t.date].expenses += t.amount;
    });
    return Object.values(map)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((d) => ({ ...d, label: new Date(d.date + "T00:00:00").toLocaleDateString("en-KE", { month: "short", day: "numeric" }) }));
  }, [filtered]);

  const summary = useMemo(
    () => filtered.slice().sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time)),
    [filtered]
  );

  function exportCSV() {
    const header = ["Date", "Time", "Description", "Category", "Method", "Type", "Amount (KSh)"];
    const rows = summary.map((t) => [
      t.date, t.time, `"${t.desc.replace(/"/g, '""')}"`, t.category, t.method, t.type, t.amount,
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `pesatrack-report_${start}_to_${end}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div className="f-display" style={{ fontSize: 22, fontWeight: 700, color: INK }}>Reports</div>
        <button
          onClick={exportCSV}
          className="f-display"
          style={{
            display: "flex", alignItems: "center", gap: 8, background: SURFACE, color: INK, border: `1.5px solid ${BORDER}`,
            padding: "10px 16px", borderRadius: 11, fontSize: 13.5, fontWeight: 600, cursor: "pointer",
          }}
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Range selector */}
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "16px 18px", marginBottom: 20, display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {RANGE_OPTIONS.map((r) => (
            <button
              key={r.id}
              onClick={() => setRangeType(r.id)}
              className="f-body"
              style={{
                padding: "9px 14px", borderRadius: 9, cursor: "pointer", fontSize: 13, fontWeight: 500, whiteSpace: "nowrap",
                border: rangeType === r.id ? `1.5px solid ${EMERALD}` : `1.5px solid ${BORDER}`,
                background: rangeType === r.id ? `${EMERALD}0D` : SURFACE,
                color: rangeType === r.id ? EMERALD : TEXT_DIM,
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
        {rangeType === "custom" && (
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ position: "relative" }}>
              <Calendar size={15} color={TEXT_DIM} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
              <input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} style={{ ...inputStyle, paddingLeft: 36, width: 165 }} />
            </div>
            <span style={{ color: TEXT_DIM, fontSize: 13 }}>to</span>
            <div style={{ position: "relative" }}>
              <Calendar size={15} color={TEXT_DIM} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
              <input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} style={{ ...inputStyle, paddingLeft: 36, width: 165 }} />
            </div>
          </div>
        )}
        <span className="f-mono" style={{ fontSize: 12, color: TEXT_DIM, marginLeft: "auto" }}>{start === end ? start : `${start} → ${end}`}</span>
      </div>

      {/* Summary cards */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
        <StatCard label="Total Sales" value={fmt(totalSales)} icon={TrendingUp} accent={EMERALD} />
        <StatCard label="Total Expenses" value={fmt(totalExpenses)} icon={TrendingDown} accent={BRICK} />
        <StatCard label="Net Profit" value={fmt(netProfit)} icon={Wallet} accent={GOLD} />
        <StatCard label="Number of Transactions" value={String(filtered.length)} icon={Hash} accent="#2E5EAA" />
      </div>

      {/* Sales vs Expenses chart */}
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "22px 20px", marginBottom: 16 }}>
        <div className="f-display" style={{ fontSize: 15.5, fontWeight: 600, color: INK, marginBottom: 4 }}>Sales vs Expenses</div>
        <div style={{ fontSize: 12.5, color: TEXT_DIM, marginBottom: 18 }}>{start === end ? "Selected day" : "Selected range, by day"}</div>
        {chartData.length === 0 ? (
          <div style={{ fontSize: 13.5, color: TEXT_DIM, padding: "40px 0", textAlign: "center" }}>No transactions in this range.</div>
        ) : (
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid stroke={BORDER} vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: TEXT_DIM, fontFamily: "Inter" }} axisLine={{ stroke: BORDER }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: TEXT_DIM, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip formatter={(v, n) => [fmt(v), n === "sales" ? "Sales" : "Expenses"]} contentStyle={{ borderRadius: 10, border: `1px solid ${BORDER}`, fontFamily: "Inter", fontSize: 13 }} />
                <Legend wrapperStyle={{ fontFamily: "Inter", fontSize: 12.5 }} formatter={(v) => (v === "sales" ? "Sales" : "Expenses")} />
                <Bar dataKey="sales" fill={EMERALD} radius={[6, 6, 0, 0]} />
                <Bar dataKey="expenses" fill={BRICK} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Breakdowns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, marginBottom: 16 }} className="lg:grid-cols-2">
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "22px 20px" }}>
          <div className="f-display" style={{ fontSize: 15.5, fontWeight: 600, color: INK, marginBottom: 4 }}>Sales by Payment Method</div>
          <div style={{ fontSize: 12.5, color: TEXT_DIM, marginBottom: 18 }}>{start === end ? "Selected day" : "Selected range"}</div>
          <PaymentMix transactions={filtered} />
        </div>
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "22px 20px" }}>
          <div className="f-display" style={{ fontSize: 15.5, fontWeight: 600, color: INK, marginBottom: 4 }}>Expenses by Category</div>
          <div style={{ fontSize: 12.5, color: TEXT_DIM, marginBottom: 18 }}>{start === end ? "Selected day" : "Selected range"}</div>
          <CategoryBreakdown transactions={filtered} />
        </div>
      </div>

      {/* Transaction summary table */}
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "22px 20px" }}>
        <div className="f-display" style={{ fontSize: 15.5, fontWeight: 600, color: INK, marginBottom: 16 }}>Transaction Summary</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                {["Date", "Time", "Description", "Category", "Method", "Type", "Amount"].map((h) => (
                  <th key={h} style={{ textAlign: h === "Amount" ? "right" : "left", padding: "0 8px 10px", fontSize: 12, color: TEXT_DIM, fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {summary.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: "36px 8px", textAlign: "center", fontSize: 13.5, color: TEXT_DIM }}>
                    No transactions in this range.
                  </td>
                </tr>
              )}
              {summary.map((t) => (
                <tr key={t.id} style={{ borderBottom: `1px solid ${BORDER}` }}>
                  <td className="f-mono" style={{ padding: "12px 8px", fontSize: 12.5, color: TEXT_DIM, whiteSpace: "nowrap" }}>{t.date}</td>
                  <td className="f-mono" style={{ padding: "12px 8px", fontSize: 12.5, color: TEXT_DIM, whiteSpace: "nowrap" }}>{t.time}</td>
                  <td style={{ padding: "12px 8px", fontSize: 13.5, color: INK }}>{t.desc}</td>
                  <td style={{ padding: "12px 8px", fontSize: 12.5, color: TEXT_DIM }}>{t.category}</td>
                  <td style={{ padding: "12px 8px", fontSize: 12.5 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: TEXT_DIM }}>
                      <MethodIcon method={t.method} size={12} /> {t.method}
                    </span>
                  </td>
                  <td style={{ padding: "12px 8px", fontSize: 12 }}>
                    <span
                      className="f-body"
                      style={{
                        padding: "3px 9px", borderRadius: 999, fontSize: 11.5, fontWeight: 600,
                        background: t.type === "sale" ? `${EMERALD}15` : `${BRICK}15`,
                        color: t.type === "sale" ? EMERALD : BRICK,
                      }}
                    >
                      {t.type === "sale" ? "Sale" : "Expense"}
                    </span>
                  </td>
                  <td className="f-mono" style={{ padding: "12px 8px", fontSize: 13.5, fontWeight: 600, textAlign: "right", color: t.type === "sale" ? EMERALD : BRICK, whiteSpace: "nowrap" }}>
                    {t.type === "sale" ? "+" : "−"}{fmt(t.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CategoryBreakdown({ transactions }) {
  const expenses = transactions.filter((t) => t.type === "expense");
  const total = expenses.reduce((s, t) => s + t.amount, 0) || 1;
  const categories = Array.from(new Set(expenses.map((t) => t.category)));
  const byCategory = categories
    .map((c) => ({ category: c, amount: expenses.filter((t) => t.category === c).reduce((s, t) => s + t.amount, 0) }))
    .sort((a, b) => b.amount - a.amount);
  const palette = [BRICK, GOLD, "#2E5EAA", EMERALD, "#7B5EA6", "#5C7A6B"];

  if (byCategory.length === 0) {
    return <div style={{ fontSize: 13.5, color: TEXT_DIM, padding: "20px 0", textAlign: "center" }}>No expenses in this range.</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 4 }}>
      {byCategory.map((c, i) => {
        const pct = Math.round((c.amount / total) * 100);
        const color = palette[i % palette.length];
        return (
          <div key={c.category}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: INK, fontWeight: 500 }}>
                <Tag size={13} color={color} /> {c.category}
              </span>
              <span className="f-mono" style={{ fontSize: 12.5, color: TEXT_DIM }}>{fmt(c.amount)} · {pct}%</span>
            </div>
            <div style={{ height: 7, background: BG, borderRadius: 999, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 999, transition: "width 500ms ease" }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PaymentMix({ transactions }) {
  const sales = transactions.filter((t) => t.type === "sale");
  const total = sales.reduce((s, t) => s + t.amount, 0) || 1;
  const byMethod = METHODS.map((m) => ({
    method: m,
    amount: sales.filter((t) => t.method === m).reduce((s, t) => s + t.amount, 0),
  }));
  const colors = { "M-Pesa": EMERALD, "Cash": GOLD, "Card": "#2E5EAA" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 4 }}>
      {byMethod.map((m) => {
        const pct = Math.round((m.amount / total) * 100);
        return (
          <div key={m.method}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: INK, fontWeight: 500 }}>
                <MethodIcon method={m.method} size={13} /> {m.method}
              </span>
              <span className="f-mono" style={{ fontSize: 12.5, color: TEXT_DIM }}>{fmt(m.amount)} · {pct}%</span>
            </div>
            <div style={{ height: 7, background: BG, borderRadius: 999, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: colors[m.method], borderRadius: 999, transition: "width 500ms ease" }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
