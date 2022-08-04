import mongoose from "mongoose";


const linkSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    original_name: {
        type: String,
        required: true,
    },
    downloads: {
        type: Number,
        default: 1
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    password: {
        type: String,
        default: null,
    },
    created: {
        type: Date,
        default: Date.now()
    }
}, {
    timestamps: true
});


const Link = mongoose.model("Link", linkSchema);
export default Link;