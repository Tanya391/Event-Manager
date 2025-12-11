const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const Student = require('./models/Student');
require('dotenv').config();

const cleanDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const adminEmail = process.env.ADMIN_DEFAULT_EMAIL;
        console.log(`Target Admin Email: ${adminEmail}`);

        // 1. Delete conflicting Students
        const deletedStudent = await Student.findOneAndDelete({ email: adminEmail });
        if (deletedStudent) {
            console.log(`[DELETED] Conflicting Student record for ${adminEmail}`);
        } else {
            console.log(`[OK] No conflicting Student record found.`);
        }

        // 2. Delete other Admins
        const result = await Admin.deleteMany({ email: { $ne: adminEmail } });
        console.log(`[DELETED] ${result.deletedCount} other admin accounts.`);

        // 3. Ensure Default Admin Exists
        const admin = await Admin.findOne({ email: adminEmail });
        if (!admin) {
            console.log("Default admin missing. It will be created on server restart.");
        } else {
            console.log("[OK] Default Admin exists.");
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

cleanDatabase();
