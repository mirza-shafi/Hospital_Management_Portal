import express from "express";
import { 
    patientRegister,
    login, 
    addNewAdmin,
    getAllDoctors
} from "../controller/userController.js"; // Import login function
import {
    isAdminAuthenticated,
    isPatientAuthenticated,
} from "../middlewares/auth.js";

const router = express.Router();

router.post("/patient/register", patientRegister);
router.post("/login", login);
router.post("/admin/addnew", isAdminAuthenticated, addNewAdmin)
router.get("/doctors", getAllDoctors);

export default router;

//2:13 minute
