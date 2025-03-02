import mongoose from 'mongoose';
// import validator from 'validator';

const UserSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, 'Please Add First Name'],
            minlength: 3,
            maxlength: 20,
            trim: true,
        },
        lastName: {
            type: String,
            required: [true, 'Please Add Last Name'],
            minlength: 3,
            maxlength: 20,
            trim: true,
        },
        userName: {
            type: String,
            required: [true, 'Please Add User Name'],
            minlength: 3,
            maxlength: 20,
            trim: true,

        },
        email: {
            type: String,
            required: [true, 'Please Add Email'],
            unique: true,
            trim: true,
            lowercase: true,
            // validate: [validator.isEmail, 'Please provide a valid email'],
        },
        password: {
            type: String,
            required: [true, 'Please Add Password'],
            minlength: 8,
            trim: true,
        },
        otp: {
            type: String,
        },
        expiresIn: {
            type: Date
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        isAdmin:{
            type: Boolean,
            default: false
        },
        // PasswordResetToken: {
        //     type: String,
        //     required: [true, 'Please Add Password'],
        //     minlength: 8,
        //     trim: true,
        // },
        ExpiryPasswordResetToken: {
            type: Date,
        },
        img:{
            type: String
        },
        address:{
            type: String
        },
        phone: {
            type: String
        }
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Users', UserSchema);