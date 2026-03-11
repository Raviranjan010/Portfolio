import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    tech: {
        type: [String],
        required: true,
    },
    image: {
        type: String, // Keeping it as a string here for now. We will map this appropriately on the frontend.
        required: true,
    },
    year: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
});

export default mongoose.model('Project', projectSchema);
