import mongoose, { Schema } from "mongoose";

const UserFormSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: [true, 'User ID is required']
    },
    applicantName: {
        type: String,
        required: [true, 'Applicant name is required'],
        trim: true
    },
    gender: {
        type: String,
        required: [true, 'Gender is required'],
        enum: ['male', 'female', 'other']
    },
    contactNumber: {
        type: String,
        required: [true, 'Contact number is required']
    },
    emailId: {
        type: String,
        required: [true, 'Email ID is required'],
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    address: {
        type: String,
        required: [true, 'Address is required']
    },
    rtiCaseNumber: {
        type: String,
        required: [true, 'RTI case number is required'],
        unique: [true, 'RTI case number already exists']
    },
    subject: {
        type: String,
        required: [true, 'Subject is required'],
        trim: true
    },
    applicationMode: {
        type: String,
        required: [true, 'Application mode is required'],
        enum: ['online', 'offline', 'post', 'in-person']
    },
    dateOfReceipt: {
        type: Date,
        required: [true, 'Date of receipt is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
        trim: true
    },
    assignedOfficer: {
        type: String,
        required: [true, 'Assigned officer is required'],
        trim: true
    },
    dueDate: {
        type: Date,
        required: [true, 'Due date is required']
    },
    extendedDueDate: {
        type: Date,
        default: null
    },
    reminderFrequency: {
        type: String,
        required: [true, 'Reminder frequency is required'],
        enum: ['daily', 'weekly', 'bi-weekly', 'monthly']
    },
    applicationDocument: {
            type: String,
            
        },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true 
});

UserFormSchema.pre('save', function() {
    this.updatedAt = Date.now();
    // next();
});


UserFormSchema.index({ userId: 1, rtiCaseNumber: 1 });
UserFormSchema.index({ dueDate: 1 });
UserFormSchema.index({ department: 1 });

const UserForm = mongoose.model('UserForm', UserFormSchema);
export default UserForm;