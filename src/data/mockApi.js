/**
 * mockApi.js — Simulates async backend API calls with realistic delays.
 * Mimics a REST API: fetch, create, update, delete transactions.
 * In a real app, replace these with actual fetch() calls to your backend.
 */

const DELAY = { short: 300, medium: 600, long: 1000 };

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Simulated server-side store (mirrors localStorage in real use)
let _serverStore = null;

function getServerStore(transactions) {
  if (!_serverStore) _serverStore = [...transactions];
  return _serverStore;
}

function syncStore(transactions) {
  _serverStore = [...transactions];
}

/**
 * GET /api/transactions
 * Returns all transactions, optionally filtered.
 */
export async function apiGetTransactions(transactions, params = {}) {
  await delay(DELAY.medium);

  let data = [...getServerStore(transactions)];

  if (params.type && params.type !== 'all') {
    data = data.filter((t) => t.type === params.type);
  }
  if (params.category && params.category !== 'all') {
    data = data.filter((t) => t.category === params.category);
  }

  return { ok: true, data, total: data.length };
}

/**
 * POST /api/transactions
 * Creates a new transaction.
 */
export async function apiCreateTransaction(transactions, transaction) {
  await delay(DELAY.short);
  syncStore(transactions);
  _serverStore = [transaction, ..._serverStore];
  return { ok: true, data: transaction, message: 'Transaction created successfully.' };
}

/**
 * PUT /api/transactions/:id
 * Updates an existing transaction.
 */
export async function apiUpdateTransaction(transactions, updated) {
  await delay(DELAY.short);
  syncStore(transactions);
  _serverStore = _serverStore.map((t) => (t.id === updated.id ? updated : t));
  return { ok: true, data: updated, message: 'Transaction updated successfully.' };
}

/**
 * DELETE /api/transactions/:id
 * Deletes a transaction by ID.
 */
export async function apiDeleteTransaction(transactions, id) {
  await delay(DELAY.short);
  syncStore(transactions);
  _serverStore = _serverStore.filter((t) => t.id !== id);
  return { ok: true, message: 'Transaction deleted successfully.' };
}

/**
 * GET /api/summary
 * Returns aggregated financial summary.
 */
export async function apiGetSummary(transactions) {
  await delay(DELAY.medium);
  const data = getServerStore(transactions);

  const totalIncome = data
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0);

  const totalExpenses = data
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);

  return {
    ok: true,
    data: {
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
      savingsRate: totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0,
      transactionCount: data.length,
    },
  };
}
