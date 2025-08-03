const mongoose = require('mongoose');
const transactionSchema = new mongoose.Schema({
    txId: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: 'USDC' },
    timestamp: { type: Date, default: Date.now },
    status: { type: String, required: true, enum: ['pending', 'completed', 'failed'], default: 'pending' }
});
module.exports = mongoose.model('Transaction', transactionSchema);