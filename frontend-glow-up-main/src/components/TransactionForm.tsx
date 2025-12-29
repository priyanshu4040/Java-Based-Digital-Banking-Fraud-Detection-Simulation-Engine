import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, X, Loader2, Send, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionFormProps {
  onTransactionSubmitted?: () => void;
}

interface FormData {
  transactionId: string;
  amount: string;
  currency: string;
  senderAccount: string;
  receiverAccount: string;
  transactionType: string;
  channel: string;
  ipAddress: string;
  location: string;
}

const initialFormData: FormData = {
  transactionId: "",
  amount: "",
  currency: "INR",
  senderAccount: "",
  receiverAccount: "",
  transactionType: "TRANSFER",
  channel: "MOBILE",
  ipAddress: "",
  location: "",
};

const currencies = ["INR", "USD", "EUR", "GBP"];
const transactionTypes = ["TRANSFER", "WITHDRAW", "DEPOSIT", "PAYMENT"];
const channels = ["MOBILE", "ATM", "CARD", "NETBANKING"];

const TransactionForm = ({ onTransactionSubmitted }: TransactionFormProps) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string }>({ type: "", text: "" });

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (message.text) {
      setMessage({ type: "", text: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    // Validate required fields
    if (!formData.transactionId || !formData.amount || !formData.senderAccount || !formData.receiverAccount) {
      setMessage({ type: "error", text: "Please fill in all required fields" });
      setLoading(false);
      return;
    }

    // Validate amount
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setMessage({ type: "error", text: "Amount must be a positive number" });
      setLoading(false);
      return;
    }

    // Prepare transaction data for API
    // Generate timestamp in format: yyyy-MM-dd HH:mm:ss
    const now = new Date();
    const timestamp = now.toISOString().slice(0, 19).replace('T', ' ');

    const transactionData = {
      transactionId: formData.transactionId,
      timestamp: timestamp,
      amount: amount,
      currency: formData.currency,
      senderAccount: formData.senderAccount,
      receiverAccount: formData.receiverAccount,
      transactionType: formData.transactionType,
      channel: formData.channel,
      ipAddress: formData.ipAddress || undefined,
      location: formData.location || undefined,
    };

    // Call API
    try {
      const { createTransaction } = await import("@/services/transactionApi");
      const result = await createTransaction(transactionData);

      if (result.success) {
        setMessage({
          type: "success",
          text: result.data || "Transaction submitted successfully!",
        });

        setFormData(initialFormData);

        if (onTransactionSubmitted) {
          onTransactionSubmitted();
        }
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to submit transaction. Please try again.",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData(initialFormData);
    setMessage({ type: "", text: "" });
  };

  return (
    <div className="w-full">
      <div className="card-elevated p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground">Submit New Transaction</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Fill in the transaction details below. Status will be determined automatically by the system.
          </p>
        </div>

        {message.text && (
          <div
            className={cn(
              "alert mb-6 animate-fade-in",
              message.type === "success" ? "alert-success" : "alert-error"
            )}
          >
            {message.type === "success" ? (
              <Check className="w-5 h-5 flex-shrink-0" />
            ) : (
              <X className="w-5 h-5 flex-shrink-0" />
            )}
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Transaction ID & Amount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="transactionId" className="form-label">
                Transaction ID <span className="form-required">*</span>
              </Label>
              <Input
                id="transactionId"
                value={formData.transactionId}
                onChange={(e) => handleChange("transactionId", e.target.value)}
                placeholder="e.g., TXN123456789"
                className="form-input"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="form-label">
                Amount <span className="form-required">*</span>
              </Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                placeholder="0.00"
                min="0.01"
                step="0.01"
                className="form-input"
                required
              />
            </div>
          </div>

          {/* Row 2: Currency & Transaction Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="currency" className="form-label">
                Currency <span className="form-required">*</span>
              </Label>
              <Select value={formData.currency} onValueChange={(value) => handleChange("currency", value)}>
                <SelectTrigger className="form-input">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent className="bg-card border border-border">
                  {currencies.map((curr) => (
                    <SelectItem key={curr} value={curr}>
                      {curr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="transactionType" className="form-label">
                Transaction Type <span className="form-required">*</span>
              </Label>
              <Select value={formData.transactionType} onValueChange={(value) => handleChange("transactionType", value)}>
                <SelectTrigger className="form-input">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-card border border-border">
                  {transactionTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 3: Sender & Receiver Accounts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="senderAccount" className="form-label">
                Sender Account <span className="form-required">*</span>
              </Label>
              <Input
                id="senderAccount"
                value={formData.senderAccount}
                onChange={(e) => handleChange("senderAccount", e.target.value)}
                placeholder="e.g., AC12345678"
                className="form-input"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="receiverAccount" className="form-label">
                Receiver Account <span className="form-required">*</span>
              </Label>
              <Input
                id="receiverAccount"
                value={formData.receiverAccount}
                onChange={(e) => handleChange("receiverAccount", e.target.value)}
                placeholder="e.g., AC87654321"
                className="form-input"
                required
              />
            </div>
          </div>

          {/* Row 4: Channel & IP Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="channel" className="form-label">
                Channel <span className="form-required">*</span>
              </Label>
              <Select value={formData.channel} onValueChange={(value) => handleChange("channel", value)}>
                <SelectTrigger className="form-input">
                  <SelectValue placeholder="Select channel" />
                </SelectTrigger>
                <SelectContent className="bg-card border border-border">
                  {channels.map((ch) => (
                    <SelectItem key={ch} value={ch}>
                      {ch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ipAddress" className="form-label">
                IP Address
              </Label>
              <Input
                id="ipAddress"
                value={formData.ipAddress}
                onChange={(e) => handleChange("ipAddress", e.target.value)}
                placeholder="e.g., 192.168.1.1"
                className="form-input"
              />
            </div>
          </div>

          {/* Row 5: Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="form-label">
              Location
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="e.g., Mumbai, India"
              className="form-input"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 sm:flex-none bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Transaction
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleClear}
              className="flex-1 sm:flex-none"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear Form
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
