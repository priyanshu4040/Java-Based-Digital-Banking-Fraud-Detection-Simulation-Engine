package com.example.transaction_api.repository;

import com.example.transaction_api.model.Transaction;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class TransactionRepository {

    private final JdbcTemplate jdbcTemplate;

    public TransactionRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void insertTransaction(Transaction t) {

        String sql = """
            INSERT INTO transactions (
                transaction_id, timestamp_val, currency, amount,
                sender_account, receiver_account, transaction_type,
                channel, status, ip_address, location
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """;

        jdbcTemplate.update(sql,
                t.getTransactionId(),
                t.getTimestamp(),
                t.getCurrency(),
                t.getAmount(),
                t.getSenderAccount(),
                t.getReceiverAccount(),
                t.getTransactionType(),
                t.getChannel(),
                t.getStatus(),
                t.getIpAddress(),
                t.getLocation()
        );
    }
}
