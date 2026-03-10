import mongoose from 'mongoose';
const { Schema } = mongoose;

const PasswdSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        passwd: {
            type: String,
            required: true,
            trim: true,
            minlength: 16,
        },
    },
    { timestamps: true }
);

export default mongoose.model('Passwd', PasswdSchema);