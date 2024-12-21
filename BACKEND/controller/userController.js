import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";

export const patientRegister = catchAsyncErrors(async (req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        nid,
        role,
    } = req.body;

    // Validate all required fields
    if (
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !password ||
        !gender ||
        !dob ||
        !nid ||
        !role
    ) {
        return next(new ErrorHandler("Please fill out the entire form!", 400));
    }

    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
        return next(new ErrorHandler("User already registered!", 400));
    }

    // Create a new user
    await User.create({
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        nid,
        role,
    });

    // Send a response with only the success message
    res.status(201).json({
        success: true,
        message: "User registered successfully!",
    });
});

//1:34:26----->