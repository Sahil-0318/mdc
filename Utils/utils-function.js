import jwt from 'jsonwebtoken'
import User from '../models/userModel/userSchema.js'
import crypto from 'crypto'
import unirest from 'unirest'

export const subAdminAuth = async (req, res, next) => {
    try {
        const token = req.cookies.uid
        const verifiedUser = jwt.verify(token, process.env.SECRET_KEY)
        // console.log(verifiedUser)
        const user = await User.findOne({ _id: verifiedUser.id })
        if (user.isSubAdmin == true) {
            req.id = user._id
        }
        else {
            res.redirect('login')
        }
        next()

    } catch (error) {
        res.status(401).redirect('login')
    }
}

export const generatePassword = () => {
    const length = 8;
    const charset = "ABCDEFGH2JKL3MN4PQR5STU6VWX7Y89";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}

export const generateUserId = (email, mobileNumber) => {
    return (email.slice(0, 6) + mobileNumber.slice(3, 7) + "@MDCN").toUpperCase()
}


// Generate Unique Order ID
export const generateOrderId = (length = 12) => {
    return crypto.randomBytes(length).toString('hex').substring(0, length);
}

// Get Current Date in BillDesk Format (IST)
export const billDeskFormattedDate = () => {
    const currentDate = new Date();
    return new Date(currentDate.getTime() + (5.5 * 60 * 60 * 1000)) // Convert to IST
        .toISOString()
        .replace(/\.\d+Z$/, '+05:30');
}

// Get Current Formatted Timestamp for BillDesk
export const billDeskFormattedTimestamp = () => {
    const now = new Date();
    return now.toISOString().replace(/[-T:.Z]/g, '').substring(0, 14); // YYYYMMDDHHMMSS
}

export const generateReceiptNumber = (roll, semester, orderId) => {

    // Clean up semester (optional: remove "SEM-" or keep as is)
    const sem = semester.toUpperCase(); // "SEM-1"

    // Format the receipt number
    return `${roll}-${sem}-${orderId}`;
}

export const sendCredentialsOnMobile = (userId, password, mobileNumber) => {
    return new Promise((resolve, reject) => {
        const req = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");

        req.headers({
            "authorization": process.env.FAST2SMS_API
        });

        req.form({
            sender_id: process.env.DLT_USER_PSSWORD_SENDER_ID,
            message: process.env.YOUR_USER_PSSWORD_MESSAGE_ID,
            variables_values: `${userId}|${password}`,
            route: "dlt",
            numbers: mobileNumber,
        });

        req.end((res) => {
            if (res.error || res.status >= 400) {
                console.error("SMS send failed:", res.error || res.body);
                return reject(new Error("Failed to send credentials via SMS."));
            }

            console.log("SMS sent successfully:", res.body);
            return resolve(res.body);
        });
    });
};

export const getDateAndTime = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const dateAndTime = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`
    return dateAndTime
}