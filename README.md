# FinFlow — Finance Dashboard

A clean, minimal, and interactive personal finance dashboard built with React + Vite.

---

## 🚀 Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | **React 18 + Vite** | Fast HMR, modern tooling |
| Routing | **React Router v6** | Declarative page navigation |
| State | **React Context + useReducer** | No extra dependencies, clean architecture |
| Charts | **Recharts** | React-native, composable, lightweight |
| Styling | **Plain CSS** (one file per page/component) | Full control, no runtime overhead |
| Persistence | **localStorage** | Survives page refreshes, no backend needed |
| Fonts | **DM Sans + DM Mono** | Sharp, modern finance aesthetic |

---

## 📁 Project Structure

```
src/
├── context/
│   └── AppContext.jsx          # Global state: transactions, role, theme, filters
├── data/
│   └── mockData.js             # 60+ mock transactions + helper functions      
|   └── mockApi.js              # Simulated REST API with async delays
├── pages/
│   ├── Dashboard/
│   │   ├── Dashboard.jsx       # Overview page
│   │   └── Dashboard.css       # Dashboard-specific styles
│   ├── Transactions/
│   │   ├── Transactions.jsx    # Transaction table page
│   │   └── Transactions.css    # Transaction-specific styles
│   └── Insights/
│       ├── Insights.jsx        # Analytics & insights page
│       └── Insights.css        # Insights-specific styles
├── components/
│   ├── Navbar/                 # Sidebar navigation
│   ├── SummaryCard/            # Metric cards
│   ├── TransactionModal/       # Add/Edit modal
│   └── EmptyState/             # Empty data fallback
├── App.jsx                     # Router + layout shell
├── App.css                     # Global design tokens (CSS variables)
└── main.jsx                    # React entry point
```

---

## ✨ Features

### Core
- **Dashboard Overview** — Summary cards (balance, income, expenses, savings rate), area chart for cash flow trend, donut chart for spending by category, recent transactions list
- **Transactions Page** — Full table with pagination (12/page), multi-field search, filter by type/category/date range, sort by date or amount, row-level edit/delete
- **Insights Page** — Top spending category, average monthly expense, savings rate analysis, month-over-month comparison with delta %, category breakdown with progress bars, radar chart for spending shape

## Role-Based UI
 
Switch roles using the **dropdown in the sidebar** — no backend, purely frontend.
 
| Action | Admin | Viewer |
|---|---|---|
| View data | ✅ | ✅ |
| Export data | ✅ | ✅ |
| Add transaction | ✅ | ❌ |
| Edit transaction | ✅ | ❌ |
| Delete transaction | ✅ | ❌ |
 
In Viewer mode: add/edit/delete buttons are hidden, the Actions column disappears entirely, and the modal cannot be opened.

### Bonus Features
- 🌙 **Dark / Light mode** — Fully themed with CSS variables, persisted
- 💾 **localStorage persistence** — Transactions, theme, and role survive refreshes
- 📤 **Export** — Download filtered transactions as CSV or JSON
- 📱 **Responsive** — Mobile sidebar with overlay, stacked layouts on small screens
- ✨ **Animations** — Page transitions, card stagger reveals, row fade-ins

---

## 🏃 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
http://localhost:5173
```

### Build for Production
```bash
npm run build
npm run preview
```

---

## 🎨 Design Decisions

- **CSS Variables** for all colors — swapping dark/light is a single attribute change on `<html>`
- **Separate CSS per component/page** — no style bleed, easy to find and modify
- **DM Mono** for all numbers — makes financial figures easier to scan
- **Minimal color palette** — accent blue, semantic green/red, muted grays; no decorative color noise
- **Animations via CSS keyframes** — no JS animation library needed, performant

---

## 💡 Assumptions Made

- All data is in USD
- "Savings Rate" = (Income − Expenses) / Income × 100
- Role switching is for UI demonstration only — no auth backend
- Mock data spans Jan–Jun 2024 to populate charts meaningfully

---

## 🧪 State Management Approach

Uses a single `AppContext` with `useReducer`:

```
AppState
├── transactions[]     — source of truth for all transaction data
├── theme              — 'dark' | 'light'
├── role               — 'admin' | 'viewer'
└── filters{}          — search, type, category, dateFrom, dateTo, sortBy, sortDir
```

Derived data (totals, monthly rollups, category aggregates) is computed with `useMemo` in each page component — not stored in state — keeping the store minimal and always consistent.
