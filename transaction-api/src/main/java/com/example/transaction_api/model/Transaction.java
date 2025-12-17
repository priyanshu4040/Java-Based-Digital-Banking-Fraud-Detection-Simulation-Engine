package com.example.transaction_api.model;

import jakarta.validation.constraints.*;

public class Transaction {

    @NotBlank
    private String transactionId;

    @NotBlank
    private String timestamp;

    @Pattern(regexp = "INR|USD|EUR|GBP", message = "Invalid currency")
    private String currency;

    @Positive
    private double amount;

    @NotBlank
    private String senderAccount;

    @NotBlank
    private String receiverAccount;

    private String transactionType;
    private String channel;
    private String status;
    private String ipAddress;
    private String location;

    // 🔴 Fraud-related
    private boolean fraudFlag;
    private String fraudReason;
    private String mlPrediction; // FRAUD / NOT_FRAUD

    // ---------- Getters & Setters ----------
    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public String getSenderAccount() { return senderAccount; }
    public void setSenderAccount(String senderAccount) { this.senderAccount = senderAccount; }

    public String getReceiverAccount() { return receiverAccount; }
    public void setReceiverAccount(String receiverAccount) { this.receiverAccount = receiverAccount; }

    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }

    public String getChannel() { return channel; }
    public void setChannel(String channel) { this.channel = channel; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public boolean isFraudFlag() { return fraudFlag; }
    public void setFraudFlag(boolean fraudFlag) { this.fraudFlag = fraudFlag; }

    public String getFraudReason() { return fraudReason; }
    public void setFraudReason(String fraudReason) { this.fraudReason = fraudReason; }

    public String getMlPrediction() { return mlPrediction; }
    public void setMlPrediction(String mlPrediction) { this.mlPrediction = mlPrediction; }
}
