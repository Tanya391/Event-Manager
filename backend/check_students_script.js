const mongoose = require('mongoose');
const Student = require('./models/Student');
require('dotenv').config();

const checkStudents = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const students = await Student.find({});
        console.log("--- START STUDENTS LIST ---");
        console.log(JSON.stringify(students, null, 2));
        console.log("--- END STUDENTS LIST ---");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkStudents();
