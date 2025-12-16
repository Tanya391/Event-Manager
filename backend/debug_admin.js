require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');

async function checkAdmins() {
    await connectDB();

    console.log('--- Environment Variables ---');
    console.log('ADMIN_DEFAULT_EMAIL from env:', process.env.ADMIN_DEFAULT_EMAIL);

    console.log('\n--- Database Records ---');
    const admins = await Admin.find({});
    if (admins.length === 0) {
        console.log('No admins found in database.');
    } else {
        for (const admin of admins) {
            console.log(`Admin found: ID=${admin._id}, Name="${admin.name}", Email="${admin.email}"`);

            const envPass = process.env.ADMIN_DEFAULT_PASSWORD;
            if (envPass) {
                try {
                    const isMatch = await admin.comparePassword(envPass);
                    console.log(`Matching against .env password: ${isMatch ? 'PASSED ✅' : 'FAILED ❌'}`);
                } catch (e) {
                    console.log('Error comparing password:', e.message);
                }
            } else {
                console.log('No password in .env to check against.');
            }
        }
    }

    mongoose.connection.close();
}

checkAdmins();
