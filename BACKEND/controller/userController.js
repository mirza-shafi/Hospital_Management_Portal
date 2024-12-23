import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";
import {generateToken} from "../utils/jwtToken.js";

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
    generateToken(user, "User Registered!", 200, res)
});


// login 
export const login = catchAsyncErrors(async(req,res,next)=>{
    const {
        email,
        password,
        confirmPassword,
        role
    } = req.body;
    if(
        !email ||
        !password ||
        !confirmPassword ||
        !role
    ){
        return next(new ErrorHandler("Please Provide All Details!", 400));
    }
    if(password !== confirmPassword){
        return next(new ErrorHandler("Wrong Password", 400));
    }
    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid Password Or Email", 400));
    }
    const isPasswordMatchd = await user.comparePassword(password);
    if(!isPasswordMatchd){
        return next(new ErrorHandler("Wrong Password", 400));
    }
    if(role !== user.role){
        return next(new ErrorHandler("User With This Role Not Found", 400));
    }
    generateToken(user, "User Login Successfully!", 200, res);
});

//admin

export const addNewAdmin = catchAsyncErrors(async(req, res, next)=>{
    const {
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        nid,
    } = req.body;
    if (
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !password ||
        !gender ||
        !dob ||
        !nid
    ) {
        return next(new ErrorHandler("Please fill out the entire form!", 400));
    }
    const isRegistered = await User.findOne({email});
    if (isRegistered){
        return next(new ErrorHandler(` ${isRegistered.role} With This Email Already Exists!`));
    }
    const admin = await User.create({
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        nid,
        role: "Admin",
    })
    res.status(201).json({
        success : true,
        message : "New Admin Registered!",
    })
})

//for doctor

export const getAllDoctors = catchAsyncErrors(async(req, res, next)=>{
    const doctors = await User.find({role: "Doctor"});
    res.status(200).json({
        success : true,
        doctors,
    })
})