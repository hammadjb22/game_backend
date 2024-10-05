const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define custom validators
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhoneNumber = (phoneNumber) => {
  const phoneRegex = /^0\d{10}$/; // Assuming a 10-digit phone number
  return phoneRegex.test(phoneNumber);
};



const validatePassword=(password)=>{
  if(!password){
    return"*password required"
  }
  else if(password.length<8){
    return"*short password"
  }
  else if(!/[A-Z]/.test(password) && !/[!@#$%^&*(),.?":{}|<>]/.test(password)){
   return"*uppercase and special character missing"
  } 
  else if(!/[A-Z]/.test(password)){
    return"*uppercase letter missing"
  } 
  else if(!/[!@#$%^&*(),.?":{}|<>]/.test(password)){
   return "*special character missing"
  }

  else{
    return true
  }
  
}


const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true, // Trims any leading/trailing whitespaces
    minlength: [2, 'Name must be at least 2 characters long'],
    unique:true
  },
  fullName: {
    type: String,
    required: [true, 'Full Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true, // Ensures email is unique in the collection
    trim: true,
    lowercase: true,
    validate: {
      validator: validateEmail,
      message: 'Please enter a valid email address'
    }
  },
  religion: {
    type: String,
    enum: ['islam', 'hinduism', 'christianity','buddhism'], // Example enum, you can update with real options
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'], // Example enum, you can update with real options
    required: true
  },
  dob: {
    type: Date, // Use Date to handle date of birth
    required: true,
    validate: {
      validator: function (value) {
        // Validate age is between 5 and 50 years
        const age = new Date().getFullYear() - value.getFullYear();
        return age >= 5 && age <= 50;
      },
      message: 'Age must be between 5 and 50 years'
    }
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    validate: {
      validator: validatePhoneNumber,
      message: 'Please enter a valid 11-digit phone number'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    validate: {
      validator: validatePassword,
      message: props => props.reason || 'Password validation failed' // Default message if none is returned
    }
  },
  confirmPassword: {
    type: String,
    required: [true, 'Confirm password is required'],
    validate: {
      validator: function (value) {
        // Ensure confirmPassword matches password
        return value === this.password;
      },
      message: 'Passwords must match'
    }
  },
  token:String
}, { timestamps: true });

// Pre-save middleware to handle password encryption (for example, using bcrypt)
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     this.confirmPassword = undefined; // Don't store confirmPassword in the database
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

module.exports.User = mongoose.model('User', userSchema);


