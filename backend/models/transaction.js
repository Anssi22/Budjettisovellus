// backend/models/transaction.js

const mongoose = require("mongoose");

// Luodaan transactions skeema
const transactionSchema = new mongoose.Schema(
    {   
        title: { type: String, required: true, trim: true },
        amountCents: { type: Number, required: true },
        type: { type: String, required: true, enum: ["income", "expense"] },
        date: { type: String, required: true },
    },
    {
    // 3) createdAt / updatedAt automaattisesti
        timestamps: true,
    },
);

// Tehdään malli "Transaction"
module.exports = mongoose.model("Transaction", transactionSchema);
