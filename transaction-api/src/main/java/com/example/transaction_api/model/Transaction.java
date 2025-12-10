package com.example.transaction_api.model;

public class Transaction {

    private String transactionId;
    private String timestamp;
    private String currency;
    private double amount;
    private String senderAccount;
    private String receiverAccount;
    private String transactionType;
    private String channel;
    private String status;
    private String ipAddress;
    private String location;

    // ✅ No-arg constructor (required for JSON mapping)
    public Transaction() {
    }

    // ✅ All-args constructor
    public Transaction(String transactionId, String timestamp, String currency, double amount,
                       String senderAccount, String receiverAccount, String transactionType,
                       String channel, String status, String ipAddress, String location) {

        this.transactionId = transactionId;
        this.timestamp = timestamp;
        this.currency = currency;
        this.amount = amount;
        this.senderAccount = senderAccount;
        this.receiverAccount = receiverAccount;
        this.transactionType = transactionType;
        this.channel = channel;
        this.status = status;
        this.ipAddress = ipAddress;
        this.location = location;
    }

    // ✅ Getters and Setters

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getSenderAccount() {
        return senderAccount;
    }

    public void setSenderAccount(String senderAccount) {
        this.senderAccount = senderAccount;
    }

    public String getReceiverAccount() {
        return receiverAccount;
    }

    public void setReceiverAccount(String receiverAccount) {
        this.receiverAccount = receiverAccount;
    }

    public String getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(String transactionType) {
        this.transactionType = transactionType;
    }

    public String getChannel() {
        return channel;
    }

    public void setChannel(String channel) {
        this.channel = channel;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}
