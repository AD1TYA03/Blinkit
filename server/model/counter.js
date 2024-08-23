import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
    name: {
        typeof: String,
        required: true,
        unique: true,
    },
    sequence_value:{
        type: Number,
        default: 0,
    },
});


const Counter = mongoose.model('Counter',counterSchema);

export default Counter;