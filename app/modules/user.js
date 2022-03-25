import mongoose from "mongoose";
const Schema = mongoose.Schema;

export default mongoose.model('User', new Schema({
    nama: {
        type: String,
        required: true
    },
    pass: {
        type: String,
        required: true
    }
}))