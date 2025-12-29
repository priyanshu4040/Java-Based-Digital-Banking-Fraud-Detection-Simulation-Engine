package com.example.transaction_api.controller;

import com.example.transaction_api.model.Transaction;
import com.example.transaction_api.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService service;

    public TransactionController(TransactionService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<?> saveTransaction(
            @Valid @RequestBody Transaction transaction,
            BindingResult result) {

        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(result.getAllErrors());
        }

        service.processTransaction(transaction);

        return ResponseEntity.ok(
                "Transaction saved. Status = " + transaction.getStatus()
        );
    }

    @GetMapping
    public ResponseEntity<?> getAllTransactions() {
        return ResponseEntity.ok(service.getAllTransactions());
    }

    @GetMapping("/fraud")
    public ResponseEntity<List<Transaction>> getFraudTransactions() {
        return ResponseEntity.ok(service.getFraudTransactions());
    }

    @GetMapping("/success")
    public ResponseEntity<List<Transaction>> getSuccessTransactions() {
        return ResponseEntity.ok(service.getSuccessTransactions());
    }

    @GetMapping("/failed")
    public ResponseEntity<List<Transaction>> getFailedTransactions() {
        return ResponseEntity.ok(service.getFailedTransactions());
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Transaction>> getPendingTransactions() {
        return ResponseEntity.ok(service.getPendingTransactions());
    }


}
