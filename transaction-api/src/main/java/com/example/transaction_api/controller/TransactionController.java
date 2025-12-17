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

        // ❌ Priority 1 – Invalid data → reject
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(result.getAllErrors());
        }

        // ⚠ Priority 2 – Rule-based flagging
        String fraudMsg = service.checkFraudRules(transaction);

        service.saveTransaction(transaction);

        return ResponseEntity.ok(
                "Transaction saved successfully. " + fraudMsg
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


}
