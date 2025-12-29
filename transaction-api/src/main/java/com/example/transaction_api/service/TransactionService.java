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

    public void processTransaction(Transaction txn) {

        if (txn.getAmount() <= 0) {
            txn.setStatus("FAILED");
            txn.setFraudFlag(false);
            txn.setFraudReason("Invalid amount");
            repository.insertTransaction(txn);
            return;
        }

        if (txn.getSenderAccount().equals(txn.getReceiverAccount())) {
            txn.setStatus("FAILED");
            txn.setFraudFlag(false);
            txn.setFraudReason("Sender and receiver same");
            repository.insertTransaction(txn);
            return;
        }

        // FRAUD SIGNALS (Allow but flag)
        StringBuilder alerts = new StringBuilder();

        if (txn.getAmount() > 100000) {
            alerts.append("High amount. ");
        }

        if (txn.getIpAddress() != null && txn.getIpAddress().startsWith("172.")) {
            alerts.append("Suspicious IP. ");
        }

        int velocity = repository.countRecentTransactions(txn.getSenderAccount());
        if (velocity >= 3) {
            alerts.append("High transaction velocity. ");
        }

        Double avg = repository.avgAmountLast5Min(txn.getSenderAccount());
        if (avg != null && avg > 0 && txn.getAmount() > avg * 3) {
            alerts.append("Rapid amount spike. ");
        }

        int failedAttempts =
                repository.countRecentFailedTxns(txn.getSenderAccount());
        if (failedAttempts >= 2) {
            alerts.append("Multiple failed attempts before success. ");
        }

        // 🟡 Decision
        if (!alerts.isEmpty()) {
            txn.setStatus("PENDING");
            txn.setFraudFlag(true);
            txn.setFraudReason(alerts.toString());
        } else {
            txn.setStatus("SUCCESS");
            txn.setFraudFlag(false);
            txn.setFraudReason("NONE");
        }

        repository.insertTransaction(txn);
    }

    public List<Transaction> getAllTransactions() {
        return repository.findAll();
    }

    public List<Transaction> getFraudTransactions() {
        return repository.findFraudTransactions();
    }

    public List<Transaction> getSuccessTransactions() {
        return repository.findByStatus("SUCCESS");
    }

    public List<Transaction> getFailedTransactions() {
        return repository.findByStatus("FAILED");
    }

    public List<Transaction> getPendingTransactions() {
        return repository.findByStatus("PENDING");
    }

}

