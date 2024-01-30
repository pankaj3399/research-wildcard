const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

const EmployeeSchema= new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Name is required"],
        minlength: [2, "Name must be at least 2 characters long"]
    },
    email:{
        type: String,
        required: [true, "Email is required"],
    
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 5 characters long"]
    },
});

EmployeeSchema.methods.authenticate = function(password)
{
    return bcrypt.compareSync(password, this.password);
}

module.exports= mongoose.model("Employee", EmployeeSchema)
