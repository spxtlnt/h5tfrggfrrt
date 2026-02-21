import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, LogOut, Users, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBooksData } from '../hooks/useBooksData';
import LoadingBlock from '../components/Books/LoadingBlock';
import EmptyState from '../components/Books/EmptyState';
import TabBar from '../components/Books/TabBar';
import NewInvoiceModal from '../components/Books/NewInvoiceModal';
import NewCustomerModal from '../components/Books/NewCustomerModal';
import NewVendorModal from '../components/Books/NewVendorModal';
import NewExpenseModal from '../components/Books/NewExpenseModal';
import ExpenseDetailModal from '../components/Books/ExpenseDetailModal';
import QuickStatsSection from '../components/Books/QuickStatsSection';
import RecentInvoicesList from '../components/Books/RecentInvoicesList';
import RecentExpensesList from '../components/Books/RecentExpensesList';
import InvoiceTable from '../components/Books/InvoiceTable';
import ExpenseTable from '../components/Books/ExpenseTable';
import CustomerCard from '../components/Books/CustomerCard';
import VendorCard from '../components/Books/VendorCard';

const tabs = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'invoices', label: 'Invoices' },
  { id: 'customers', label: 'Customers' },
  { id: 'vendors', label: 'Vendors' },
  { id: 'expenses', label: 'Expenses' },
  { id: 'reports', label: 'Reports' },
];

export default function Books() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
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
    handleCreateInvoice: hookHandleCreateInvoice,
    handleCreateCustomer: hookHandleCreateCustomer,
    handleCreateVendor: hookHandleCreateVendor,
    handleCreateExpense: hookHandleCreateExpense,
    handleViewExpense,
    handleDeleteExpense,
    handleDeleteCustomer,
    handleDeleteVendor,
    setSelectedExpense,
  } = useBooksData();

  const [activeTab, setActiveTab] = useState('dashboard');

  // Modal visibility states
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
  const [showNewVendorModal, setShowNewVendorModal] = useState(false);
  const [showNewExpenseModal, setShowNewExpenseModal] = useState(false);
  const [showExpenseDetailModal, setShowExpenseDetailModal] = useState(false);

  // Form states
  const [invoiceForm, setInvoiceForm] = useState({
    customer_id: '',
    description: '',
    quantity: 1,
    rate: 0,
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: '',
  });

  const [customerForm, setCustomerForm] = useState({
    contact_name: '',
    email: '',
    phone: '',
    company_name: '',
  });

  const [vendorForm, setVendorForm] = useState({
    contact_name: '',
    email: '',
    phone: '',
    company_name: '',
  });

  const [expenseForm, setExpenseForm] = useState({
    vendor_id: '',
    account_id: expenseAccounts.length > 0 ? expenseAccounts[0].account_id : '',
    reference_number: '',
    amount: 0,
    expense_date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  // Load data based on active tab
  useEffect(() => {
    if (!isConnected || !organizationId) return;

    switch (activeTab) {
      case 'dashboard':
        loadDashboardData();
        break;
      case 'invoices':
        loadInvoicesData();
        break;
      case 'customers':
        loadCustomersData();
        break;
      case 'vendors':
        loadVendorsData();
        break;
      case 'expenses':
        loadExpensesData();
        break;
      case 'reports':
        loadReportsData();
        break;
    }
  }, [activeTab, isConnected, organizationId, loadDashboardData, loadInvoicesData, loadCustomersData, loadVendorsData, loadExpensesData, loadReportsData]);

  // Load expense accounts when expense modal opens
  useEffect(() => {
    if (showNewExpenseModal && isConnected && organizationId) {
      loadExpenseAccountsData();
    }
  }, [showNewExpenseModal, isConnected, organizationId, loadExpenseAccountsData]);

  // Handle form submissions
  const handleSubmitInvoice = async (e: React.FormEvent) => {
    if (!invoiceForm.customer_id) {
      alert('Please select a customer');
      return;
    }
    if (!invoiceForm.description) {
      alert('Please enter a description');
      return;
    }
    if (invoiceForm.quantity <= 0) {
      alert('Quantity must be greater than 0');
      return;
    }
    if (invoiceForm.rate <= 0) {
      alert('Rate must be greater than 0');
      return;
    }

    await hookHandleCreateInvoice(e, invoiceForm);
    if (savingInvoice === false) {
      setInvoiceForm({
        customer_id: '',
        description: '',
        quantity: 1,
        rate: 0,
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        notes: '',
      });
      setShowNewInvoiceModal(false);
    }
  };

  const handleSubmitCustomer = async (e: React.FormEvent) => {
    if (!customerForm.contact_name) {
      alert('Please enter customer name');
      return;
    }

    await hookHandleCreateCustomer(e, customerForm);
    if (savingCustomer === false) {
      setCustomerForm({
        contact_name: '',
        email: '',
        phone: '',
        company_name: '',
      });
      setShowNewCustomerModal(false);
    }
  };

  const handleSubmitVendor = async (e: React.FormEvent) => {
    if (!vendorForm.contact_name) {
      alert('Please enter vendor name');
      return;
    }

    await hookHandleCreateVendor(e, vendorForm);
    if (savingVendor === false) {
      setVendorForm({
        contact_name: '',
        email: '',
        phone: '',
        company_name: '',
      });
      setShowNewVendorModal(false);
    }
  };

  const handleSubmitExpense = async (e: React.FormEvent) => {
    if (!expenseForm.vendor_id) {
      alert('Please select a vendor');
      return;
    }
    if (!expenseForm.account_id) {
      alert('Please select an expense account');
      return;
    }
    if (expenseForm.amount <= 0) {
      alert('Amount must be greater than 0');
      return;
    }

    await hookHandleCreateExpense(e, expenseForm);
    if (savingExpense === false) {
      setExpenseForm({
        vendor_id: '',
        account_id: expenseAccounts.length > 0 ? expenseAccounts[0].account_id : '',
        reference_number: '',
        amount: 0,
        expense_date: new Date().toISOString().split('T')[0],
        notes: '',
      });
      setShowNewExpenseModal(false);
    }
  };

  // Show loading or not connected state
  if (isProcessingCallback || loading) {
    return (
      <div className="min-h-screen pt-20 pb-12 px-4 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <LoadingBlock message="Initializing Zoho Books..." />
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen pt-20 pb-12 px-4 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Books</h1>
            <p className="text-gray-300">Manage your invoices, customers, vendors, and expenses</p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-rose-500/20 to-purple-600/20 border border-rose-500/30 rounded-xl p-12 text-center">
              <div className="mb-6">
                <AlertCircle className="w-16 h-16 text-rose-400 mx-auto mb-4" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Connect Zoho Books</h2>
              <p className="text-gray-300 mb-8">
                Connect your Zoho Books account to manage invoices, customers, vendors, and expenses all in one place.
              </p>
              <button
                onClick={async () => {
                  try {
                    const url = await getConnectUrl();
                    window.location.href = url;
                  } catch (error) {
                    console.error('Failed to get connect URL:', error);
                  }
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors font-semibold"
              >
                Connect with Zoho Books
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Books</h1>
            <p className="text-gray-300">Manage your invoices, customers, vendors, and expenses</p>
          </div>
          <button
            onClick={handleDisconnect}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-gray-300 rounded-lg hover:bg-slate-700 transition-colors font-medium"
          >
            <LogOut className="w-4 h-4" />
            Disconnect
          </button>
        </div>

        {/* Tabs */}
        <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <QuickStatsSection
              invoicesCount={invoices.length}
              customersCount={customers.length}
              expenses={expenses}
              hasReports={!!reports}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentInvoicesList invoices={invoices} limit={5} />
              <RecentExpensesList expenses={expenses} limit={5} />
            </div>
          </div>
        )}

        {/* Invoices Tab */}
        {activeTab === 'invoices' && (
          <div className="space-y-6">
            <button
              onClick={() => setShowNewInvoiceModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors font-semibold"
            >
              <Plus className="w-4 h-4" />
              New Invoice
            </button>

            {loadingInvoices ? (
              <LoadingBlock message="Loading invoices..." />
            ) : invoices.length === 0 ? (
              <EmptyState icon={<AlertCircle />} message="No invoices found" />
            ) : (
              <InvoiceTable invoices={invoices} />
            )}
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <button
              onClick={() => setShowNewCustomerModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors font-semibold"
            >
              <Plus className="w-4 h-4" />
              New Customer
            </button>

            {loadingCustomers ? (
              <LoadingBlock message="Loading customers..." />
            ) : customers.length === 0 ? (
              <EmptyState icon={<Users />} message="No customers found" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {customers.map((customer) => (
                  <CustomerCard
                    key={customer.contact_id}
                    customer={customer}
                    onDelete={handleDeleteCustomer}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Vendors Tab */}
        {activeTab === 'vendors' && (
          <div className="space-y-6">
            <button
              onClick={() => setShowNewVendorModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors font-semibold"
            >
              <Plus className="w-4 h-4" />
              New Vendor
            </button>

            {loadingVendors ? (
              <LoadingBlock message="Loading vendors..." />
            ) : vendors.length === 0 ? (
              <EmptyState icon={<Users />} message="No vendors found" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vendors.map((vendor) => (
                  <VendorCard
                    key={vendor.contact_id}
                    vendor={vendor}
                    onDelete={handleDeleteVendor}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Expenses Tab */}
        {activeTab === 'expenses' && (
          <div className="space-y-6">
            <button
              onClick={() => setShowNewExpenseModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors font-semibold"
            >
              <Plus className="w-4 h-4" />
              New Expense
            </button>

            {loadingExpenses ? (
              <LoadingBlock message="Loading expenses..." />
            ) : expenses.length === 0 ? (
              <EmptyState icon={<AlertCircle />} message="No expenses found" />
            ) : (
              <ExpenseTable
                expenses={expenses}
                currency={currency}
                onView={(expense) => {
                  setSelectedExpense(expense);
                  setShowExpenseDetailModal(true);
                }}
                onDelete={handleDeleteExpense}
              />
            )}
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            {loadingReports ? (
              <LoadingBlock message="Loading reports..." />
            ) : (
              <div className="space-y-6">
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-yellow-300 text-sm">
                  <p className="font-medium">📊 Financial Reports</p>
                  <p className="mt-1">Reports are generated from your Zoho Books data. Ensure you have transactions recorded for accurate reports.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white/5 rounded-xl border border-white/10 p-6">
                    <h3 className="text-xl font-bold text-white mb-6">Profit & Loss</h3>
                    {reports && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <span className="text-gray-400">Total Income</span>
                          <span className="text-white font-semibold">
                            ${typeof reports.total_income === 'number' ? reports.total_income.toFixed(2) : 0}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <span className="text-gray-400">Total Expenses</span>
                          <span className="text-white font-semibold">
                            ${typeof reports.total_expenses === 'number' ? reports.total_expenses.toFixed(2) : 0}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                          <span className="text-emerald-300 font-semibold">Net Profit</span>
                          <span className="text-emerald-300 font-bold text-lg">
                            ${typeof reports.net_profit === 'number' ? reports.net_profit.toFixed(2) : 0}
                          </span>
                        </div>
                      </div>
                    )}
                    {!reports && (
                      <div className="text-center py-8 text-gray-400">
                        <p>No report data available</p>
                      </div>
                    )}
                  </div>

                  <div className="bg-white/5 rounded-xl border border-white/10 p-6">
                    <h3 className="text-xl font-bold text-white mb-6">Balance Sheet</h3>
                    {reports && (reports.total_assets !== undefined || reports.total_liabilities !== undefined) ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <span className="text-gray-400">Total Assets</span>
                          <span className="text-white font-semibold">
                            ${typeof reports.total_assets === 'number' ? reports.total_assets.toFixed(2) : 0}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <span className="text-gray-400">Total Liabilities</span>
                          <span className="text-white font-semibold">
                            ${typeof reports.total_liabilities === 'number' ? reports.total_liabilities.toFixed(2) : 0}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        <p>Balance sheet data not available</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modals */}
        <NewInvoiceModal
          isOpen={showNewInvoiceModal}
          form={invoiceForm}
          setForm={setInvoiceForm}
          customers={customers}
          saving={savingInvoice}
          onSubmit={handleSubmitInvoice}
          onClose={() => setShowNewInvoiceModal(false)}
        />

        <NewCustomerModal
          isOpen={showNewCustomerModal}
          form={customerForm}
          setForm={setCustomerForm}
          saving={savingCustomer}
          onSubmit={handleSubmitCustomer}
          onClose={() => setShowNewCustomerModal(false)}
        />

        <NewVendorModal
          isOpen={showNewVendorModal}
          form={vendorForm}
          setForm={setVendorForm}
          saving={savingVendor}
          onSubmit={handleSubmitVendor}
          onClose={() => setShowNewVendorModal(false)}
        />

        <NewExpenseModal
          isOpen={showNewExpenseModal}
          form={expenseForm}
          setForm={setExpenseForm}
          vendors={vendors}
          expenseAccounts={expenseAccounts}
          loading={loadingExpenses}
          saving={savingExpense}
          onSubmit={handleSubmitExpense}
          onClose={() => setShowNewExpenseModal(false)}
        />

        <ExpenseDetailModal
          isOpen={showExpenseDetailModal}
          expense={selectedExpense}
          currency={currency}
          onClose={() => setShowExpenseDetailModal(false)}
          onDelete={() => {
            handleDeleteExpense(selectedExpense!.expense_id);
            setShowExpenseDetailModal(false);
          }}
        />
      </div>
    </div>
  );
}
