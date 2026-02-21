import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from './useToast';
import { supabase } from '../lib/supabase';
import {
  getZohoBooksAuthUrl,
  getZohoBooksStatus,
  getInvoices,
  getCustomers,
  getExpenses,
  getProfitAndLoss,
  getOrganizationId,
  getOrganizationDetails,
  disconnectZohoBooks,
  createInvoice,
  createCustomer,
  createExpense,
  createVendor,
  getExpense,
  updateExpense,
  deleteExpense,
  getVendors,
  deleteVendor,
  deleteCustomer,
  getExpenseAccounts,
} from '../lib/zohoBooksService';

export interface Invoice {
  invoice_id: string;
  invoice_number: string;
  customer_name: string;
  total: number;
  status: string;
  invoice_date: string;
  due_date: string;
}

export interface Customer {
  contact_id: string;
  contact_name: string;
  email: string;
  company_name?: string;
  phone?: string;
}

export interface Vendor {
  contact_id: string;
  contact_name: string;
  email: string;
  company_name?: string;
  phone?: string;
}

export interface Expense {
  expense_id: string;
  vendor_name: string;
  vendor_id?: string;
  amount: number;
  status: string;
  expense_date: string;
  reference_number?: string;
  customer_name?: string;
  paid_through?: string;
  account_name?: string;
  account_id?: string;
  currency?: string;
}

export interface ExpenseAccount {
  account_id: string;
  account_name: string;
  account_type: string;
}

export interface UseBooksDataResult {
  // Connection state
  isConnected: boolean;
  organizationId: string | null;
  currency: string;
  loading: boolean;
  isProcessingCallback: boolean;

  // Data
  invoices: Invoice[];
  customers: Customer[];
  vendors: Vendor[];
  expenses: Expense[];
  expenseAccounts: ExpenseAccount[];
  reports: any;

  // Selected items
  selectedExpense: Expense | null;

  // Loading states
  loadingInvoices: boolean;
  loadingCustomers: boolean;
  loadingVendors: boolean;
  loadingExpenses: boolean;
  loadingReports: boolean;

  // Saving states
  savingInvoice: boolean;
  savingCustomer: boolean;
  savingVendor: boolean;
  savingExpense: boolean;

  // Actions
  getConnectUrl: () => Promise<string>;
  handleDisconnect: () => Promise<void>;
  loadInvoicesData: () => Promise<void>;
  loadCustomersData: () => Promise<void>;
  loadVendorsData: () => Promise<void>;
  loadExpensesData: () => Promise<void>;
  loadExpenseAccountsData: () => Promise<void>;
  loadDashboardData: () => Promise<void>;
  loadReportsData: () => Promise<void>;
  handleCreateInvoice: (e: React.FormEvent, form: any) => Promise<void>;
  handleCreateCustomer: (e: React.FormEvent, form: any) => Promise<void>;
  handleCreateVendor: (e: React.FormEvent, form: any) => Promise<void>;
  handleCreateExpense: (e: React.FormEvent, form: any) => Promise<void>;
  handleViewExpense: (expenseId: string) => Promise<void>;
  handleDeleteExpense: (expenseId: string) => Promise<void>;
  handleDeleteCustomer: (customerId: string) => Promise<void>;
  handleDeleteVendor: (vendorId: string) => Promise<void>;
  setSelectedExpense: (expense: Expense | null) => void;
}

export function useBooksData(): UseBooksDataResult {
  const { user } = useAuth();
  const { addToast } = useToast();

  // Connection state
  const [isConnected, setIsConnected] = useState(false);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [currency, setCurrency] = useState<string>('USD');
  const [loading, setLoading] = useState(true);
  const [isProcessingCallback, setIsProcessingCallback] = useState(false);

  // Data states
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expenseAccounts, setExpenseAccounts] = useState<ExpenseAccount[]>([]);
  const [reports, setReports] = useState<any>(null);

  // Selected items
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  // Loading states
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [loadingVendors, setLoadingVendors] = useState(false);
  const [loadingExpenses, setLoadingExpenses] = useState(false);
  const [loadingReports, setLoadingReports] = useState(false);

  // Saving states
  const [savingInvoice, setSavingInvoice] = useState(false);
  const [savingCustomer, setSavingCustomer] = useState(false);
  const [savingVendor, setSavingVendor] = useState(false);
  const [savingExpense, setSavingExpense] = useState(false);

  // OAuth callback handler
  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');
        const errorParam = url.searchParams.get('error');

        if (!code && !errorParam) {
          return;
        }

        if (errorParam) {
          addToast(`Authorization failed: ${errorParam}`, 'error');
          window.history.replaceState({}, document.title, '/books');
          return;
        }

        if (!user?.id) {
          return;
        }

        if (!code) {
          return;
        }

        setIsProcessingCallback(true);

        const redirectUri = import.meta.env.VITE_ZOHO_REDIRECT_URI || `${window.location.origin}/books`;

        const { data, error: functionError } = await supabase.functions.invoke('zoho-oauth-exchange', {
          body: {
            code,
            redirectUri,
            userId: user.id,
          },
        });

        if (functionError || !data?.success) {
          addToast('Failed to connect Zoho Books', 'error');
          window.history.replaceState({}, document.title, '/books');
          return;
        }

        addToast('Zoho Books connected successfully!', 'success');
        window.history.replaceState({}, document.title, '/books');

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {
        addToast(error instanceof Error ? error.message : 'Connection failed', 'error');
        window.history.replaceState({}, document.title, '/books');
      } finally {
        setIsProcessingCallback(false);
      }
    };

    handleOAuthCallback();
  }, [user?.id, addToast]);

  // Check connection status
  useEffect(() => {
    if (!user?.id || isProcessingCallback) return;

    const checkStatus = async () => {
      try {
        const status = await getZohoBooksStatus(user.id);
        setIsConnected(status.is_connected);

        if (status.is_connected) {
          if (status.organization_id) {
            setOrganizationId(status.organization_id);
            try {
              const details = await getOrganizationDetails(user.id, status.organization_id);
              setCurrency(details.currency_code);
            } catch {
              setCurrency('USD');
            }
          } else {
            try {
              const orgId = await getOrganizationId(user.id);
              setOrganizationId(orgId);
              const details = await getOrganizationDetails(user.id, orgId);
              setCurrency(details.currency_code);
            } catch (error) {
              addToast('Failed to fetch organization details', 'error');
            }
          }
        }
      } catch (error) {
        console.error('Error checking Zoho Books status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, [user?.id, isProcessingCallback, addToast]);

  const getConnectUrl = useCallback(async (): Promise<string> => {
    try {
      const url = await getZohoBooksAuthUrl();
      return url;
    } catch (error) {
      console.error('Error getting Zoho Books auth URL:', error);
      throw error;
    }
  }, []);

  const handleDisconnect = useCallback(async () => {
    if (!user?.id) return;

    try {
      await disconnectZohoBooks(user.id);
      setIsConnected(false);
      setOrganizationId(null);
      setInvoices([]);
      setCustomers([]);
      setVendors([]);
      setExpenses([]);
      addToast('Disconnected from Zoho Books', 'success');
    } catch (error) {
      addToast('Failed to disconnect', 'error');
    }
  }, [user?.id, addToast]);

  const loadInvoicesData = useCallback(async () => {
    if (!user?.id || !organizationId) return;

    setLoadingInvoices(true);
    try {
      const data = await getInvoices(user.id, organizationId);
      setInvoices(data);
    } catch (error) {
      console.error('Error loading invoices:', error);
      addToast('Failed to load invoices', 'error');
    } finally {
      setLoadingInvoices(false);
    }
  }, [user?.id, organizationId, addToast]);

  const loadCustomersData = useCallback(async () => {
    if (!user?.id || !organizationId) return;

    setLoadingCustomers(true);
    try {
      const data = await getCustomers(user.id, organizationId);
      setCustomers(data);
    } catch (error) {
      console.error('Error loading customers:', error);
      addToast('Failed to load customers', 'error');
    } finally {
      setLoadingCustomers(false);
    }
  }, [user?.id, organizationId, addToast]);

  const loadVendorsData = useCallback(async () => {
    if (!user?.id || !organizationId) return;

    setLoadingVendors(true);
    try {
      const data = await getVendors(user.id, organizationId);
      setVendors(data);
    } catch (error) {
      console.error('Error loading vendors:', error);
      addToast('Failed to load vendors', 'error');
    } finally {
      setLoadingVendors(false);
    }
  }, [user?.id, organizationId, addToast]);

  const loadExpensesData = useCallback(async () => {
    if (!user?.id || !organizationId) return;

    setLoadingExpenses(true);
    try {
      const data = await getExpenses(user.id, organizationId);
      setExpenses(data);
    } catch (error) {
      console.error('Error loading expenses:', error);
      addToast('Failed to load expenses', 'error');
    } finally {
      setLoadingExpenses(false);
    }
  }, [user?.id, organizationId, addToast]);

  const loadExpenseAccountsData = useCallback(async () => {
    if (!user?.id || !organizationId) return;

    try {
      const data = await getExpenseAccounts(user.id, organizationId);
      setExpenseAccounts(data);
    } catch (error) {
      console.error('Error loading expense accounts:', error);
    }
  }, [user?.id, organizationId]);

  const loadReportsData = useCallback(async () => {
    if (!user?.id || !organizationId) return;

    setLoadingReports(true);
    try {
      const data = await getProfitAndLoss(user.id, organizationId);
      setReports(data);
    } catch (error) {
      console.error('Error loading reports:', error);
      addToast('Failed to load reports', 'error');
    } finally {
      setLoadingReports(false);
    }
  }, [user?.id, organizationId, addToast]);

  const loadDashboardData = useCallback(async () => {
    await Promise.all([
      loadInvoicesData(),
      loadCustomersData(),
      loadVendorsData(),
      loadExpensesData(),
      loadReportsData(),
    ]);
  }, [loadInvoicesData, loadCustomersData, loadVendorsData, loadExpensesData, loadReportsData]);

  const handleCreateInvoice = useCallback(
    async (e: React.FormEvent, form: any) => {
      e.preventDefault();
      if (!user?.id || !organizationId) return;

      setSavingInvoice(true);
      try {
        await createInvoice(user.id, organizationId, {
          customer_id: form.customer_id,
          invoice_date: form.invoice_date,
          due_date: form.due_date,
          notes: form.notes,
          line_items: [
            {
              description: form.description,
              quantity: form.quantity,
              rate: form.rate,
            },
          ],
        });

        addToast('Invoice created successfully!', 'success');
        await loadInvoicesData();
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Failed to create invoice';
        addToast(errorMsg, 'error');
      } finally {
        setSavingInvoice(false);
      }
    },
    [user?.id, organizationId, addToast, loadInvoicesData]
  );

  const handleCreateCustomer = useCallback(
    async (e: React.FormEvent, form: any) => {
      e.preventDefault();
      if (!user?.id || !organizationId) return;

      setSavingCustomer(true);
      try {
        await createCustomer(user.id, organizationId, {
          contact_name: form.contact_name,
          email: form.email || undefined,
          phone: form.phone || undefined,
          company_name: form.company_name || undefined,
        });

        addToast('Customer created successfully!', 'success');
        await loadCustomersData();
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Failed to create customer';
        addToast(errorMsg, 'error');
      } finally {
        setSavingCustomer(false);
      }
    },
    [user?.id, organizationId, addToast, loadCustomersData]
  );

  const handleCreateVendor = useCallback(
    async (e: React.FormEvent, form: any) => {
      e.preventDefault();
      if (!user?.id || !organizationId) return;

      setSavingVendor(true);
      try {
        await createVendor(user.id, organizationId, {
          contact_name: form.contact_name,
          email: form.email || undefined,
          phone: form.phone || undefined,
          company_name: form.company_name || undefined,
        });

        addToast('Vendor created successfully!', 'success');
        await loadVendorsData();
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Failed to create vendor';
        addToast(errorMsg, 'error');
      } finally {
        setSavingVendor(false);
      }
    },
    [user?.id, organizationId, addToast, loadVendorsData]
  );

  const handleCreateExpense = useCallback(
    async (e: React.FormEvent, form: any) => {
      e.preventDefault();
      if (!user?.id || !organizationId) return;

      setSavingExpense(true);
      try {
        await createExpense(user.id, organizationId, {
          vendor_id: form.vendor_id,
          account_id: form.account_id,
          reference_number: form.reference_number || undefined,
          amount: form.amount,
          expense_date: form.expense_date,
          notes: form.notes || undefined,
        });

        addToast('Expense created successfully!', 'success');
        await loadExpensesData();
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Failed to create expense';
        addToast(errorMsg, 'error');
      } finally {
        setSavingExpense(false);
      }
    },
    [user?.id, organizationId, addToast, loadExpensesData]
  );

  const handleViewExpense = useCallback(
    async (expenseId: string) => {
      if (!user?.id || !organizationId) return;

      try {
        const expense = await getExpense(user.id, organizationId, expenseId);
        setSelectedExpense(expense);
      } catch (error) {
        addToast('Failed to load expense details', 'error');
      }
    },
    [user?.id, organizationId, addToast]
  );

  const handleDeleteExpense = useCallback(
    async (expenseId: string) => {
      if (!user?.id || !organizationId) return;

      try {
        await deleteExpense(user.id, organizationId, expenseId);
        setSelectedExpense(null);
        addToast('Expense deleted successfully!', 'success');
        await loadExpensesData();
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Failed to delete expense';
        addToast(errorMsg, 'error');
      }
    },
    [user?.id, organizationId, addToast, loadExpensesData]
  );

  const handleDeleteCustomer = useCallback(
    async (customerId: string) => {
      if (!user?.id || !organizationId) return;

      try {
        await deleteCustomer(user.id, organizationId, customerId);
        addToast('Customer deleted successfully!', 'success');
        await loadCustomersData();
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Failed to delete customer';
        addToast(errorMsg, 'error');
      }
    },
    [user?.id, organizationId, addToast, loadCustomersData]
  );

  const handleDeleteVendor = useCallback(
    async (vendorId: string) => {
      if (!user?.id || !organizationId) return;

      try {
        await deleteVendor(user.id, organizationId, vendorId);
        addToast('Vendor deleted successfully!', 'success');
        await loadVendorsData();
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Failed to delete vendor';
        addToast(errorMsg, 'error');
      }
    },
    [user?.id, organizationId, addToast, loadVendorsData]
  );

  return {
    isConnected,
    organizationId,
    currency,
    loading,
    isProcessingCallback,
    invoices,
    customers,
    vendors,
    expenses,
    expenseAccounts,
    reports,
    selectedExpense,
    loadingInvoices,
    loadingCustomers,
    loadingVendors,
    loadingExpenses,
    loadingReports,
    savingInvoice,
    savingCustomer,
    savingVendor,
    savingExpense,
    getConnectUrl,
    handleDisconnect,
    loadInvoicesData,
    loadCustomersData,
    loadVendorsData,
    loadExpensesData,
    loadExpenseAccountsData,
    loadDashboardData,
    loadReportsData,
    handleCreateInvoice,
    handleCreateCustomer,
    handleCreateVendor,
    handleCreateExpense,
    handleViewExpense,
    handleDeleteExpense,
    handleDeleteCustomer,
    handleDeleteVendor,
    setSelectedExpense,
  };
}
