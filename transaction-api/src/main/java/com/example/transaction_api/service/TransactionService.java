package com.example.transaction_api.service;

import com.example.transaction_api.model.Transaction;
import com.example.transaction_api.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository repository;

    public TransactionService(TransactionRepository repository) {
        this.repository = repository;
    }

    public String checkFraudRules(Transaction txn) {

        StringBuilder alerts = new StringBuilder();

        // Rule 1: High amount
        if (txn.getAmount() > 50000) {
            alerts.append("High amount. ");
        }

        // Rule 2: Suspicious IP
        if (txn.getIpAddress() != null && txn.getIpAddress().startsWith("172.")) {
            alerts.append("Suspicious IP. ");
        }

        // Rule 3: Velocity check
        int recentTxnCount =
                repository.countRecentTransactions(txn.getSenderAccount());

        if (recentTxnCount >= 3) {
            alerts.append("High transaction velocity. ");
        }

        // 🔹 Rule 4: Rapid amount change
        Double avgAmount =
                repository.avgAmountLast5Min(txn.getSenderAccount());

        if (avgAmount != null && avgAmount > 0 &&
                txn.getAmount() > avgAmount * 3) {

            alerts.append("Rapid amount spike. ");
        }

        // 🔹 Rule 5: Failed txns before success
        if ("SUCCESS".equalsIgnoreCase(txn.getStatus())) {

            int failedCount =
                    repository.countRecentFailedTxns(txn.getSenderAccount());

            if (failedCount >= 2) {
                alerts.append("Multiple failed attempts before success. ");
            }
        }

        // ⚠ Allow but flag (ML will decide final verdict)
        if (!alerts.isEmpty()) {
            txn.setFraudFlag(true);
            txn.setFraudReason(alerts.toString());
            return alerts.toString();
        }

        txn.setFraudFlag(false);
        txn.setFraudReason("NONE");
        return "No fraud detected";
    }




    public void saveTransaction(Transaction txn) {
        repository.insertTransaction(txn);
    }

    public List<Transaction> getAllTransactions() {
        return repository.findAll();
    }

    public List<Transaction> getFraudTransactions() {
        return repository.findFraudTransactions();
    }

}
