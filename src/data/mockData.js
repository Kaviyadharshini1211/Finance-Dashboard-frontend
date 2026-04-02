export const CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Healthcare',
  'Utilities',
  'Rent',
  'Salary',
  'Freelance',
  'Investment',
  'Travel',
  'Education',
];

export const CATEGORY_COLORS = {
  'Food & Dining': '#f97316',
  'Transportation': '#3b82f6',
  'Shopping': '#a855f7',
  'Entertainment': '#ec4899',
  'Healthcare': '#14b8a6',
  'Utilities': '#f59e0b',
  'Rent': '#ef4444',
  'Salary': '#22c55e',
  'Freelance': '#10b981',
  'Investment': '#6366f1',
  'Travel': '#06b6d4',
  'Education': '#84cc16',
};

let idCounter = 1;
const makeId = () => `txn_${String(idCounter++).padStart(4, '0')}`;

const raw = [
  // Jan
  { date: '2024-01-03', desc: 'Monthly Salary', amount: 5200, category: 'Salary', type: 'income' },
  { date: '2024-01-04', desc: 'Apartment Rent', amount: 1400, category: 'Rent', type: 'expense' },
  { date: '2024-01-05', desc: 'Grocery Run', amount: 134, category: 'Food & Dining', type: 'expense' },
  { date: '2024-01-07', desc: 'Netflix Subscription', amount: 18, category: 'Entertainment', type: 'expense' },
  { date: '2024-01-09', desc: 'Uber Rides', amount: 46, category: 'Transportation', type: 'expense' },
  { date: '2024-01-12', desc: 'Freelance Project', amount: 800, category: 'Freelance', type: 'income' },
  { date: '2024-01-14', desc: 'Amazon Shopping', amount: 210, category: 'Shopping', type: 'expense' },
  { date: '2024-01-15', desc: 'Doctor Visit', amount: 75, category: 'Healthcare', type: 'expense' },
  { date: '2024-01-18', desc: 'Electricity Bill', amount: 88, category: 'Utilities', type: 'expense' },
  { date: '2024-01-22', desc: 'Restaurant Dinner', amount: 67, category: 'Food & Dining', type: 'expense' },
  { date: '2024-01-25', desc: 'Investment Return', amount: 320, category: 'Investment', type: 'income' },
  { date: '2024-01-28', desc: 'Online Course', amount: 49, category: 'Education', type: 'expense' },
  // Feb
  { date: '2024-02-01', desc: 'Monthly Salary', amount: 5200, category: 'Salary', type: 'income' },
  { date: '2024-02-02', desc: 'Apartment Rent', amount: 1400, category: 'Rent', type: 'expense' },
  { date: '2024-02-05', desc: 'Grocery Run', amount: 119, category: 'Food & Dining', type: 'expense' },
  { date: '2024-02-07', desc: 'Spotify', amount: 10, category: 'Entertainment', type: 'expense' },
  { date: '2024-02-09', desc: 'Flight Booking', amount: 380, category: 'Travel', type: 'expense' },
  { date: '2024-02-11', desc: 'Freelance Project', amount: 1200, category: 'Freelance', type: 'income' },
  { date: '2024-02-13', desc: 'Clothing', amount: 175, category: 'Shopping', type: 'expense' },
  { date: '2024-02-16', desc: 'Gas Bill', amount: 62, category: 'Utilities', type: 'expense' },
  { date: '2024-02-19', desc: 'Metro Pass', amount: 55, category: 'Transportation', type: 'expense' },
  { date: '2024-02-21', desc: 'Lunch Out', amount: 38, category: 'Food & Dining', type: 'expense' },
  { date: '2024-02-25', desc: 'Investment Return', amount: 415, category: 'Investment', type: 'income' },
  { date: '2024-02-27', desc: 'Pharmacy', amount: 34, category: 'Healthcare', type: 'expense' },
  // Mar
  { date: '2024-03-01', desc: 'Monthly Salary', amount: 5200, category: 'Salary', type: 'income' },
  { date: '2024-03-03', desc: 'Apartment Rent', amount: 1400, category: 'Rent', type: 'expense' },
  { date: '2024-03-06', desc: 'Grocery Run', amount: 156, category: 'Food & Dining', type: 'expense' },
  { date: '2024-03-08', desc: 'Movie Tickets', amount: 42, category: 'Entertainment', type: 'expense' },
  { date: '2024-03-10', desc: 'Cab Fare', amount: 28, category: 'Transportation', type: 'expense' },
  { date: '2024-03-12', desc: 'Freelance Project', amount: 950, category: 'Freelance', type: 'income' },
  { date: '2024-03-14', desc: 'Electronics', amount: 349, category: 'Shopping', type: 'expense' },
  { date: '2024-03-17', desc: 'Water Bill', amount: 40, category: 'Utilities', type: 'expense' },
  { date: '2024-03-20', desc: 'Dentist', amount: 120, category: 'Healthcare', type: 'expense' },
  { date: '2024-03-22', desc: 'Restaurant', amount: 89, category: 'Food & Dining', type: 'expense' },
  { date: '2024-03-25', desc: 'Investment Return', amount: 290, category: 'Investment', type: 'income' },
  { date: '2024-03-28', desc: 'Hotel Stay', amount: 220, category: 'Travel', type: 'expense' },
  // Apr
  { date: '2024-04-01', desc: 'Monthly Salary', amount: 5200, category: 'Salary', type: 'income' },
  { date: '2024-04-02', desc: 'Apartment Rent', amount: 1400, category: 'Rent', type: 'expense' },
  { date: '2024-04-05', desc: 'Grocery Run', amount: 142, category: 'Food & Dining', type: 'expense' },
  { date: '2024-04-08', desc: 'Concert Tickets', amount: 95, category: 'Entertainment', type: 'expense' },
  { date: '2024-04-10', desc: 'Freelance Project', amount: 1500, category: 'Freelance', type: 'income' },
  { date: '2024-04-12', desc: 'Petrol', amount: 65, category: 'Transportation', type: 'expense' },
  { date: '2024-04-15', desc: 'Clothes Shopping', amount: 230, category: 'Shopping', type: 'expense' },
  { date: '2024-04-18', desc: 'Internet Bill', amount: 55, category: 'Utilities', type: 'expense' },
  { date: '2024-04-21', desc: 'Medical Checkup', amount: 90, category: 'Healthcare', type: 'expense' },
  { date: '2024-04-24', desc: 'Investment Return', amount: 510, category: 'Investment', type: 'income' },
  { date: '2024-04-27', desc: 'Sushi Dinner', amount: 78, category: 'Food & Dining', type: 'expense' },
  // May
  { date: '2024-05-01', desc: 'Monthly Salary', amount: 5200, category: 'Salary', type: 'income' },
  { date: '2024-05-02', desc: 'Apartment Rent', amount: 1400, category: 'Rent', type: 'expense' },
  { date: '2024-05-05', desc: 'Grocery Run', amount: 128, category: 'Food & Dining', type: 'expense' },
  { date: '2024-05-08', desc: 'Freelance Project', amount: 700, category: 'Freelance', type: 'income' },
  { date: '2024-05-10', desc: 'Airline Ticket', amount: 450, category: 'Travel', type: 'expense' },
  { date: '2024-05-12', desc: 'Bus Pass', amount: 35, category: 'Transportation', type: 'expense' },
  { date: '2024-05-15', desc: 'Amazon Purchase', amount: 185, category: 'Shopping', type: 'expense' },
  { date: '2024-05-18', desc: 'Electricity Bill', amount: 94, category: 'Utilities', type: 'expense' },
  { date: '2024-05-20', desc: 'Online Course', amount: 79, category: 'Education', type: 'expense' },
  { date: '2024-05-22', desc: 'Investment Return', amount: 380, category: 'Investment', type: 'income' },
  { date: '2024-05-25', desc: 'Coffee Shop', amount: 22, category: 'Food & Dining', type: 'expense' },
  { date: '2024-05-28', desc: 'Game Purchase', amount: 60, category: 'Entertainment', type: 'expense' },
  // Jun
  { date: '2024-06-01', desc: 'Monthly Salary', amount: 5200, category: 'Salary', type: 'income' },
  { date: '2024-06-02', desc: 'Apartment Rent', amount: 1400, category: 'Rent', type: 'expense' },
  { date: '2024-06-05', desc: 'Grocery Run', amount: 162, category: 'Food & Dining', type: 'expense' },
  { date: '2024-06-07', desc: 'Freelance Project', amount: 2000, category: 'Freelance', type: 'income' },
  { date: '2024-06-10', desc: 'Taxi Rides', amount: 72, category: 'Transportation', type: 'expense' },
  { date: '2024-06-12', desc: 'Summer Clothes', amount: 310, category: 'Shopping', type: 'expense' },
  { date: '2024-06-15', desc: 'Water Bill', amount: 44, category: 'Utilities', type: 'expense' },
  { date: '2024-06-18', desc: 'Dental Cleaning', amount: 100, category: 'Healthcare', type: 'expense' },
  { date: '2024-06-20', desc: 'Investment Return', amount: 620, category: 'Investment', type: 'income' },
  { date: '2024-06-23', desc: 'Restaurant', amount: 112, category: 'Food & Dining', type: 'expense' },
  { date: '2024-06-26', desc: 'Museum Tickets', amount: 30, category: 'Entertainment', type: 'expense' },
];

export const initialTransactions = raw.map(t => ({ ...t, id: makeId() }));

export function getMonthlyData(transactions) {
  const months = {};
  transactions.forEach(t => {
    const key = t.date.slice(0, 7);
    if (!months[key]) months[key] = { month: key, income: 0, expenses: 0 };
    if (t.type === 'income') months[key].income += t.amount;
    else months[key].expenses += t.amount;
  });
  return Object.values(months)
    .sort((a, b) => a.month.localeCompare(b.month))
    .map(m => ({
      ...m,
      label: new Date(m.month + '-01').toLocaleString('default', { month: 'short', year: '2-digit' }),
      balance: m.income - m.expenses,
    }));
}

export function getCategoryData(transactions) {
  const cats = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    cats[t.category] = (cats[t.category] || 0) + t.amount;
  });
  return Object.entries(cats)
    .map(([name, value]) => ({ name, value, color: CATEGORY_COLORS[name] || '#94a3b8' }))
    .sort((a, b) => b.value - a.value);
}
