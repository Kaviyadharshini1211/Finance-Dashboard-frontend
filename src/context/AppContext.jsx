import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { initialTransactions } from '../data/mockData';
import {
  apiCreateTransaction,
  apiUpdateTransaction,
  apiDeleteTransaction,
} from '../data/mockApi';

const AppContext = createContext(null);

const STORAGE_KEY = 'finflow_data';

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function saveToStorage(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      transactions: state.transactions,
      theme: state.theme,
      role: state.role,
    }));
  } catch {}
}

const defaultState = {
  transactions: initialTransactions,
  theme: 'dark',
  role: 'admin',
  apiStatus: 'idle',
  filters: {
    search: '',
    type: 'all',
    category: 'all',
    sortBy: 'date',
    sortDir: 'desc',
    dateFrom: '',
    dateTo: '',
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_ROLE':
      return { ...state, role: action.payload };
    case 'SET_FILTER':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'RESET_FILTERS':
      return { ...state, filters: defaultState.filters };
    case 'SET_API_STATUS':
      return { ...state, apiStatus: action.payload };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions], apiStatus: 'success' };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        apiStatus: 'success',
        transactions: state.transactions.map(t =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        apiStatus: 'success',
        transactions: state.transactions.filter(t => t.id !== action.payload),
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const stored = loadFromStorage();
  const initial = stored
    ? { ...defaultState, transactions: stored.transactions, theme: stored.theme, role: stored.role }
    : defaultState;

  const [state, dispatch] = useReducer(reducer, initial);

  useEffect(() => {
    saveToStorage(state);
  }, [state.transactions, state.theme, state.role]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  const addTransaction = useCallback(async (transaction) => {
    dispatch({ type: 'SET_API_STATUS', payload: 'loading' });
    try {
      const res = await apiCreateTransaction(state.transactions, transaction);
      if (res.ok) dispatch({ type: 'ADD_TRANSACTION', payload: res.data });
    } catch {
      dispatch({ type: 'SET_API_STATUS', payload: 'error' });
    }
  }, [state.transactions]);

  const updateTransaction = useCallback(async (transaction) => {
    dispatch({ type: 'SET_API_STATUS', payload: 'loading' });
    try {
      const res = await apiUpdateTransaction(state.transactions, transaction);
      if (res.ok) dispatch({ type: 'UPDATE_TRANSACTION', payload: res.data });
    } catch {
      dispatch({ type: 'SET_API_STATUS', payload: 'error' });
    }
  }, [state.transactions]);

  const deleteTransaction = useCallback(async (id) => {
    dispatch({ type: 'SET_API_STATUS', payload: 'loading' });
    try {
      const res = await apiDeleteTransaction(state.transactions, id);
      if (res.ok) dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    } catch {
      dispatch({ type: 'SET_API_STATUS', payload: 'error' });
    }
  }, [state.transactions]);

  return (
    <AppContext.Provider value={{ state, dispatch, addTransaction, updateTransaction, deleteTransaction }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
