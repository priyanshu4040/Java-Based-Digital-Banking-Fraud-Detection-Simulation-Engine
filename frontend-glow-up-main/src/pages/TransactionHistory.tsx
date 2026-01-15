import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TransactionTable from "@/components/TransactionTable";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, subMonths, isAfter, isBefore } from "date-fns";
import {
  Shield,
  RefreshCw,
  BarChart3,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  CalendarIcon,
  Plus,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

type DurationOption = "1month" | "3months" | "6months" | "custom";

const durationOptions = [
  { id: "1month" as DurationOption, label: "1 Month" },
  { id: "3months" as DurationOption, label: "3 Months" },
  { id: "6months" as DurationOption, label: "6 Months" },
  { id: "custom" as DurationOption, label: "Custom" },
];

interface Transaction {
  transactionId: string;
  amount: number;
  currency: string;
  senderAccount: string;
  receiverAccount: string;
  status: string;
  fraudFlag: boolean;
  fraudReason: string;
  timestamp: string;
}

// Mock data removed - now using real API

const tabs = [
  { id: "all", label: "All Transactions", icon: BarChart3 },
  { id: "success", label: "Success", icon: CheckCircle2 },
  { id: "failed", label: "Failed", icon: XCircle },
  { id: "pending", label: "Pending", icon: Clock },
  { id: "fraud", label: "Fraud Alerts", icon: AlertTriangle },
];

const TransactionHistory = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState<DurationOption>("1month");
  const [customDateRange, setCustomDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });

  const getDateRange = () => {
    const now = new Date();
    switch (selectedDuration) {
      case "1month":
        return { from: subMonths(now, 1), to: now };
      case "3months":
        return { from: subMonths(now, 3), to: now };
      case "6months":
        return { from: subMonths(now, 6), to: now };
      case "custom":
        return { from: customDateRange.from, to: customDateRange.to };
      default:
        return { from: subMonths(now, 1), to: now };
    }
  };

  const filterByDuration = (txns: Transaction[]) => {
    const { from, to } = getDateRange();
    if (!from || !to) return txns;

    return txns.filter((t) => {
      const txnDate = new Date(t.timestamp);
      return isAfter(txnDate, from) && isBefore(txnDate, to);
    });
  };

  const fetchTransactions = async (tab: string) => {
    setLoading(true);
    setError(null);

    try {
      const {
        getAllTransactions,
        getSuccessTransactions,
        getFailedTransactions,
        getPendingTransactions,
        getFraudTransactions,
      } = await import("@/services/transactionApi");

      let result;
      switch (tab) {
        case "success":
          result = await getSuccessTransactions();
          break;
        case "failed":
          result = await getFailedTransactions();
          break;
        case "pending":
          result = await getPendingTransactions();
          break;
        case "fraud":
          result = await getFraudTransactions();
          break;
        default:
          result = await getAllTransactions();
      }

      if (result.success && result.data) {
        let filtered = result.data;
        filtered = filterByDuration(filtered);
        setTransactions(filtered);
      } else {
        setError(result.error || "Failed to fetch transactions");
        setTransactions([]);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(activeTab);
  }, [activeTab, refreshKey, selectedDuration, customDateRange]);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // Calculate stats from all transactions (fetch all for stats)
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchAllForStats = async () => {
      try {
        const { getAllTransactions } = await import("@/services/transactionApi");
        const result = await getAllTransactions();
        if (result.success && result.data) {
          setAllTransactions(result.data);
        }
      } catch (err) {
        // Silently fail for stats, don't show error
      }
    };
    fetchAllForStats();
  }, [refreshKey]);

  const stats = {
    total: allTransactions.length,
    success: allTransactions.filter((t) => t.status === "SUCCESS").length,
    failed: allTransactions.filter((t) => t.status === "FAILED").length,
    pending: allTransactions.filter((t) => t.status === "PENDING").length,
    fraud: allTransactions.filter((t) => t.fraudFlag === true || t.fraudFlag === 1).length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-header sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm">
                <Shield className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">Transaction History</h1>
                <p className="text-sm text-white/70">Monitor and analyze financial transactions</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button
                  variant="secondary"
                  className="bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Transaction
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button
                  variant="secondary"
                  className="bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Button
                onClick={handleRefresh}
                variant="secondary"
                className="bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm"
              >
                <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Statistics */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 animate-fade-in">
          <StatCard icon={BarChart3} value={stats.total} label="Total Transactions" variant="info" />
          <StatCard icon={CheckCircle2} value={stats.success} label="Successful" variant="success" />
          <StatCard icon={XCircle} value={stats.failed} label="Failed" variant="danger" />
          <StatCard icon={Clock} value={stats.pending} label="Pending" variant="warning" />
          <StatCard icon={AlertTriangle} value={stats.fraud} label="Fraud Alerts" variant="danger" />
        </section>

        {/* Transaction History Section */}
        <section className="card-elevated p-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
          {/* Duration Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Filter by Duration</h3>
            <div className="flex flex-wrap items-center gap-3">
              {durationOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedDuration(option.id)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    selectedDuration === option.id
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  )}
                >
                  {option.label}
                </button>
              ))}

              {selectedDuration === "custom" && (
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <CalendarIcon className="w-4 h-4" />
                        {customDateRange.from ? format(customDateRange.from, "MMM dd, yyyy") : "From"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={customDateRange.from}
                        onSelect={(date) => setCustomDateRange((prev) => ({ ...prev, from: date }))}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <span className="text-muted-foreground">to</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <CalendarIcon className="w-4 h-4" />
                        {customDateRange.to ? format(customDateRange.to, "MMM dd, yyyy") : "To"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={customDateRange.to}
                        onSelect={(date) => setCustomDateRange((prev) => ({ ...prev, to: date }))}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="tab-group mb-6 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn("tab-item whitespace-nowrap", activeTab === tab.id && "active")}
                >
                  <Icon className="w-4 h-4 inline-block mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Transaction Table */}
          <TransactionTable transactions={transactions} loading={loading} error={error} />
        </section>
      </main>
    </div>
  );
};

export default TransactionHistory;
