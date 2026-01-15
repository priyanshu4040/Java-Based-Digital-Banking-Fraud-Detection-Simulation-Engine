import { Link } from "react-router-dom";
import TransactionForm from "@/components/TransactionForm";
import AutoTransactionGenerator from "@/components/AutoTransactionGenerator";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Shield, History, BarChart3 } from "lucide-react";

const TransactionGeneration = () => {
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
                <h1 className="text-xl sm:text-2xl font-bold">Transaction Generation</h1>
                <p className="text-sm text-white/70">Submit new transactions for fraud detection</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/dashboard">
                <Button
                  variant="secondary"
                  className="bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/history">
                <Button
                  variant="secondary"
                  className="bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm"
                >
                  <History className="w-4 h-4 mr-2" />
                  View History
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-6">
        <div className="space-y-8">
          {/* Manual Transaction Form Section */}
          <section className="animate-fade-in">
            <TransactionForm />
          </section>

          {/* Separator */}
          <Separator className="my-8" />

          {/* Auto Generate Section */}
          <section className="animate-fade-in" style={{ animationDelay: "100ms" }}>
            <AutoTransactionGenerator />
          </section>
        </div>
      </main>
    </div>
  );
};

export default TransactionGeneration;
