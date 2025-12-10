package com.example.transaction_api.service;
import com.example.transaction_api.repository.TransactionRepository;
import com.example.transaction_api.model.Transaction;
import org.springframework.stereotype.Service;

@Service
public class TransactionService {

    private final TransactionRepository repository;

    public TransactionService(TransactionRepository repository) {
        this.repository = repository;
    }

    public void saveTransaction(Transaction transaction) {
        repository.insertTransaction(transaction);
    }
}
