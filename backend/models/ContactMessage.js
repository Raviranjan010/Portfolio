import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    subject: {
        type: String,
        required: true,
        trim: true,
    },
    message: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ['pending', 'delivered', 'failed'],
        default: 'pending',
    },
    deliveredAt: {
        type: Date,
    },
    failureReason: {
        type: String,
        default: '',
    },
    source: {
        ip: {
            type: String,
            default: '',
        },
        userAgent: {
            type: String,
            default: '',
        },
        origin: {
            type: String,
            default: '',
        },
    },
}, { timestamps: true });

export default mongoose.model('ContactMessage', contactMessageSchema);
