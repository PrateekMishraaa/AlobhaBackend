import express from "express"
const router = express.Router()
import UserForm from "../models/UserForm.js"
import mongoose from "mongoose";
// import { uploadMultiple } from "../middleware/upload.js";

router.post('/form/:id',  async(req, res) => {
    try {
        const { id } = req.params;
        
       
        const applicationDocuments = req.files ? req.files.map(file => file.path) : [];
        
        const {
            applicantName,
            gender,
            contactNumber,
            emailId,
            address,
            rtiCaseNumber,
            subject,
            applicationMode,
            dateOfReceipt,
            description,
            department,
            assignedOfficer,
            dueDate,
            extendedDueDate,
            reminderFrequency,
            status
        } = req.body;

     
        const existingForm = await UserForm.findOne({ rtiCaseNumber });
        if (existingForm) {
            return res.status(400).json({
                success: false,
                message: 'RTI case number already exists'
            });
        }

       
        const newForm = new UserForm({
            userId: id,
            applicantName,
            gender,
            contactNumber,
            emailId,
            address,
            rtiCaseNumber,
            subject,
            applicationMode,
            dateOfReceipt,
            description,
            department,
            assignedOfficer,
            dueDate,
            extendedDueDate: extendedDueDate || null,
            reminderFrequency,
            status: status || 'pending',
            // applicationDocument: applicationDocuments
        });

       
        const savedForm = await newForm.save();

        res.status(201).json({
            success: true,
            message: 'Form submitted successfully',
            data: savedForm,
            // uploadedFiles: applicationDocuments
        });

    } catch (error) {
      
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'RTI case number already exists'
            });
        }

     
        if (error.name === 'ValidationError') {
            const validationErrors = {};
            for (let field in error.errors) {
                validationErrors[field] = error.errors[field].message;
            }
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validationErrors
            });
        }

  
        if (error.message === 'Only PDF files are allowed' || 
            error.message === 'File too large' ||
            error.message === 'Maximum 5 files allowed') {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        console.error('Error creating form:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});
router.get('/form-data/:userId', async(req, res) => {
    try {
        const { userId } = req.params;
        
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid User ID format"
            });
        }

       
        const formData = await UserForm.find({ userId: userId })
            .sort({ createdAt: -1 });


        if (!formData || formData.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No RTI forms found for this user",
                data: []
            });
        }

        console.log(`Found ${formData.length} RTI forms for user ${userId}`);
        
        return res.status(200).json({
            success: true,
            message: "RTI forms retrieved successfully",
            count: formData.length,
            data: formData
        });

    } catch (error) {
        console.error('Error fetching RTI forms:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while fetching RTI forms",
            error: error.message
        });
    }
});
router.get('/all-forms',async(req,res)=>{
    try{
        const forms = await UserForm.find()
        console.log('forms list',forms)
        return res.status(200).json({message:"Forms data",forms})
    }catch(error){
        console.log('error',error)
        return res.status(500).json({message:"Internal server error",error})
    }
})
export default router