package com.example.transaction_api.repository;

import com.example.transaction_api.model.Transaction;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class TransactionRepository {

    private final JdbcTemplate jdbc;

    public TransactionRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    // INSERT
    public void insertTransaction(Transaction t) {

        String sql = """
        INSERT INTO TRANSACTIONS
        (TRANSACTION_ID, TIMESTAMP_VAL, CURRENCY, AMOUNT, SENDER_ACCOUNT,
         RECEIVER_ACCOUNT, TRANSACTION_TYPE, CHANNEL, STATUS,
         IP_ADDRESS, LOCATION, FRAUD_FLAG, FRAUD_REASON)
        VALUES (?, SYSDATE, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """;

        jdbc.update(sql,
                t.getTransactionId(),
                t.getCurrency(),
                t.getAmount(),
                t.getSenderAccount(),
                t.getReceiverAccount(),
                t.getTransactionType(),
                t.getChannel(),
                t.getStatus(),
                t.getIpAddress(),
                t.getLocation(),
                t.isFraudFlag() ? 1 : 0,
                t.getFraudReason()
        );
    }


    // GET ALL
    public List<Transaction> findAll() {
        String sql = "SELECT * FROM TRANSACTIONS";

        return jdbc.query(sql, transactionRowMapper());
    }

    private RowMapper<Transaction> transactionRowMapper() {
        return (rs, rowNum) -> {
            Transaction t = new Transaction();
            t.setTransactionId(rs.getString("TRANSACTION_ID"));
            t.setTimestamp(rs.getString("TIMESTAMP_VAL"));
            t.setCurrency(rs.getString("CURRENCY"));
            t.setAmount(rs.getDouble("AMOUNT"));
            t.setSenderAccount(rs.getString("SENDER_ACCOUNT"));
            t.setReceiverAccount(rs.getString("RECEIVER_ACCOUNT"));
            t.setTransactionType(rs.getString("TRANSACTION_TYPE"));
            t.setChannel(rs.getString("CHANNEL"));
            t.setStatus(rs.getString("STATUS"));
            t.setIpAddress(rs.getString("IP_ADDRESS"));
            t.setLocation(rs.getString("LOCATION"));
            t.setFraudFlag(rs.getBoolean("FRAUD_FLAG"));
            t.setFraudReason(rs.getString("FRAUD_REASON"));
            return t;
        };
    }

    public List<Transaction> findFraudTransactions() {

        String sql = """
        SELECT * FROM TRANSACTIONS
        WHERE FRAUD_FLAG = 1
        ORDER BY TIMESTAMP_VAL DESC
    """;

        return jdbc.query(sql, transactionRowMapper());
    }

    public int countRecentTransactions(String senderAccount) {
        String sql = """
        SELECT COUNT(*)
        FROM TRANSACTIONS
        WHERE SENDER_ACCOUNT = ?
        AND TIMESTAMP_VAL >= SYSDATE - (5 / (24 * 60))
    """;

        return jdbc.queryForObject(sql, Integer.class, senderAccount);
    }


    public Double avgAmountLast5Min(String senderAccount) {
        String sql = """
        SELECT AVG(AMOUNT)
        FROM TRANSACTIONS
        WHERE SENDER_ACCOUNT = ?
        AND TIMESTAMP_VAL >= SYSDATE - (5 / (24 * 60))
    """;

        return jdbc.queryForObject(sql, Double.class, senderAccount);
    }

    public int countRecentFailedTxns(String senderAccount) {
        String sql = """
        SELECT COUNT(*)
        FROM TRANSACTIONS
        WHERE SENDER_ACCOUNT = ?
        AND STATUS = 'FAILED'
        AND TIMESTAMP_VAL >= SYSDATE - (10 / (24 * 60))
    """;

        return jdbc.queryForObject(sql, Integer.class, senderAccount);
    }

    public List<Transaction> findByStatus(String status) {

        String sql = """
        SELECT * FROM TRANSACTIONS
        WHERE STATUS = ?
    """;

        return jdbc.query(sql, transactionRowMapper(), status);
    }




}
