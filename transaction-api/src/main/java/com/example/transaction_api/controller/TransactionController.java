package com.example.transaction_api.controller;

import com.example.transaction_api.model.Transaction;
import com.example.transaction_api.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService service;

    public TransactionController(TransactionService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<String> saveTransaction(@RequestBody Transaction transaction) {
        service.saveTransaction(transaction);
        return ResponseEntity.ok("Transaction saved successfully");
    }
}
