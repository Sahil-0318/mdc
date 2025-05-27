import Ug_Reg_Sem_1_25_29_User from "../../models/Ug_Reg_Sem_1_25_29_Models/user.js"
import Ug_reg_sem_1_25_29_adm_form from "../../models/Ug_Reg_Sem_1_25_29_Models/adm_Form.js"
import { generateOrderId, billDeskFormattedDate, billDeskFormattedTimestamp } from "../../Utils/utils-function.js"
import jws from 'jws'
import axios from 'axios'

export const checkoutPage = async (req, res) => {
    try {
        const user = await Ug_Reg_Sem_1_25_29_User.findById(req.id)
        const appliedUser = await Ug_reg_sem_1_25_29_adm_form.findOne({ appliedBy: user._id.toString() })

        res.render('Ug_Reg_Sem_1_25_29/checkoutPage', { user, appliedUser })
    } catch (error) {
        console.log("Error in Ug_Reg_Sem_1_25_29_Controller >> payment-Controller >> checkoutPage", error);
        req.flash("flashMessage", ["Something went wrong", "alert-danger"]);
        return res.status(500).redirect("/ug-reg-sem-1-25-29-adm-form");
    }
}

export const pay = async (req, res) => {
    try {
        const { studentName, mobileNumber, email, referenceNumber, course, category, admissionFee } = req.body
        // Validate Environment Variables
        const { BILLDESK_CLIENT_ID, BILLDESK_MERCHANT_ID, BILLDESK_CHECKSUM_KEY, ORDER_API } = process.env;
        if (!BILLDESK_CLIENT_ID || !BILLDESK_MERCHANT_ID || !BILLDESK_CHECKSUM_KEY || !ORDER_API) {
            throw new Error("Missing required environment variables for BillDesk integration.");
        }

        // Generate Unique Order ID & Get Client IP
        const orderId = generateOrderId();
        const clientIp = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress;

        // JWT Header & Payload
        const header = { alg: "HS256", clientid: BILLDESK_CLIENT_ID };
        const payload = {
            mercid: BILLDESK_MERCHANT_ID,
            orderid: orderId,
            amount: admissionFee,
            order_date: billDeskFormattedDate(),
            currency: "356",
            ru: "https://maltidharicollegenaubatpur.onrender.com/ug-reg-sem-1-25-29/payment/payResponse",
            additional_info: { customerName: studentName, mobileNumber: mobileNumber, email: email, referenceNumber: referenceNumber, course: course, category: category },
            itemcode: "DIRECT",
            device: {
                init_channel: "internet",
                ip: clientIp,
                user_agent: req.headers["user-agent"],
                accept_header: "text/html"
            }
        };

        // Generate JWT Token
        const token = jws.sign({ header, payload, secret: BILLDESK_CHECKSUM_KEY });

        // API Request to BillDesk
        const options = {
            method: "POST",
            url: ORDER_API,
            headers: {
                accept: "application/jose",
                "content-type": "application/jose",
                "BD-Traceid": orderId,
                "BD-Timestamp": billDeskFormattedTimestamp()
            },
            data: token
        };

        // Make API Request
        const response = await axios.request(options);
        // console.log("BillDesk Response:", response.data);

        // Process & Verify Response Token
        const responseToken = response.data;
        if (!jws.verify(responseToken, "HS256", BILLDESK_CHECKSUM_KEY)) {
            throw new Error("Token verification failed.");
        }

        const decoded = jws.decode(responseToken);
        const verifiedPayload = JSON.parse(decoded.payload);

        // Extract Required Values
        const { mercid: merchantId, bdorderid: bdOrderId, ru: returnUrl } = verifiedPayload;
        const authHeader = verifiedPayload?.links?.[1]?.headers?.authorization || "";
        const authToken = authHeader.startsWith("OToken ") ? authHeader.split("OToken ")[1] : authHeader;

        // console.log("✅ Verified Payload:", verifiedPayload);
        // console.log("🔹 Cleaned Auth Token:", authToken);

        // Render SDK Page with Payment Details
        res.render("SDK", { merchantId, bdOrderId, token: authHeader, returnUrl });

    } catch (error) {
        console.log("Error in Ug_Reg_Sem_1_25_29_Controller >> payment-Controller >> pay", error);
        // console.error("❌ Payment Processing Error:", error);
        console.error("❌ Payment Processing Error:", error.message);
        req.flash("flashMessage", ["Failed to process payment.", "alert-danger"]);
        return res.status(500).redirect("/ug-reg-sem-1-25-29-adm-form");
    }
}

// export const payResponse = async (req, res) => {
//     try {
//         console.log("🔹 Payment Response Received");

//         // 1️⃣ Extract transaction response from request body
//         const { transaction_response } = req.body;

//         if (!transaction_response) {
//             return res.status(400).json({ error: "No transaction response received." });
//         }

//         // 2️⃣ Verify and Decode the JWT Response
//         const secretKey = process.env.BILLDESK_CHECKSUM_KEY; // Your BillDesk secret key
//         const isVerified = jws.verify(transaction_response, "HS256", secretKey);

//         if (!isVerified) {
//             console.error("❌ Transaction response verification failed.");
//             return res.status(400).json({ error: "Invalid transaction response signature." });
//         }

//         const decoded = jws.decode(transaction_response);
//         if (!decoded || !decoded.payload) {
//             return res.status(400).json({ error: "Failed to decode transaction response." });
//         }

//         const transactionData = JSON.parse(decoded.payload);
//         // console.log("Transaction Data >> ", transactionData)

//         const user = await Ug_Reg_Sem_1_25_29_User.findById(req.id);
//         // console.log("User details >> ", user)
//         const appliedUser = await Ug_reg_sem_1_25_29_adm_form.findOne({ appliedBy: user._id.toString() });
//         // console.log("Applied User details >> ", appliedUser)

//         // 4️⃣ Handle Transaction Status
//         if (transactionData.auth_status === "0300") {
//             console.log("✅ Payment Successful!");
//             // Update the database with payment success

//             if (!appliedUser) {
//                 req.flash("flashMessage", ["Admission form not found.", "alert-danger"]);
//                 return res.redirect("/ug-reg-sem-1-25-29-adm-form");
//             }
//             // Save payment details
//             appliedUser.paymentDetails = {
//                 status: "success",
//                 mercid: transactionData.mercid,
//                 orderid: transactionData.bdorderid,
//                 transactionid: transactionData.transactionid,
//                 paymentMode: transactionData.paymode,
//                 amount: transactionData.amount,
//                 payment_method_type: transactionData.payment_method_type,
//                 date: transactionData.transaction_date,
//             };
//             await appliedUser.save();
//             user.isPaid = true;
//             await user.save();
//             return res.redirect('/ug-reg-sem-1-25-29/payment/payment-success')

//         } else if (transactionData.auth_status === "0002") {
//             console.log("⚠️ Payment Pending.");
//             appliedUser.payment = { ...paymentDetails, status: "pending" };
//             await appliedUser.save();
//             req.flash("flashMessage", ["Payment is pending. Please check again later.", "alert-warning"]);
//             return res.redirect("/ug-reg-sem-1-25-29-adm-form");
//         } else {
//             console.log("❌ Payment Failed.");
//             return res.status(400).json({ message: "Payment failed." })
//             // Handle failure (update database, notify user, etc.)
//         }

//     } catch (error) {
//         console.log("Error in Ug_Reg_Sem_1_25_29_Controller >> payment-Controller >> payResponse", error);
//         req.flash("flashMessage", ["Internal Server Error", "alert-danger"]);
//         return res.status(500).redirect("/ug-reg-sem-1-25-29-adm-form");
//     }
// }

export const payResponse = async (req, res) => {
    try {
        console.log("🔹 Payment Response Received");

        const { transaction_response } = req.body;
        if (!transaction_response) {
            return res.status(400).json({ error: "No transaction response received." });
        }

        const secretKey = process.env.BILLDESK_CHECKSUM_KEY;
        const isVerified = jws.verify(transaction_response, "HS256", secretKey);

        if (!isVerified) {
            console.error("❌ Transaction response verification failed.");
            return res.status(400).json({ error: "Invalid transaction response signature." });
        }

        const decoded = jws.decode(transaction_response);
        if (!decoded?.payload) {
            return res.status(400).json({ error: "Failed to decode transaction response." });
        }

        const transactionData = JSON.parse(decoded.payload);
        // console.log("Transaction Data >> ", transactionData)
        const { auth_status, mercid, orderid, transactionid, amount, payment_method_type, transaction_date } = transactionData;

        // Fetch User and Applied Form
        const user = await Ug_Reg_Sem_1_25_29_User.findById(req.id);
        const appliedUser = await Ug_reg_sem_1_25_29_adm_form.findOne({ appliedBy: user?._id.toString() });

        if (!user || !appliedUser) {
            req.flash("flashMessage", ["User or Admission form not found.", "alert-danger"]);
            return res.redirect("/ug-reg-sem-1-25-29-adm-form");
        }

        // Prepare payment object
        const paymentDetails = {
            mercid,
            orderid,
            transactionid,
            payment_method_type,
            amount,
            date: transaction_date,
        };

        switch (auth_status) {
            case "0300": // ✅ Success
                console.log("✅ Payment Successful");
                appliedUser.paymentDetails = { ...paymentDetails, status: "success" };
                appliedUser.isPaid = true;
                await appliedUser.save()
                return res.redirect("/ug-reg-sem-1-25-29/payment/payment-success");

            case "0002": // ⏳ Pending
                console.log("⚠️ Payment Pending");
                appliedUser.paymentDetails = { ...paymentDetails, status: "pending" };
                await appliedUser.save();
                req.flash("flashMessage", ["Payment is pending. Please check again later.", "alert-warning"]);
                return res.redirect("/ug-reg-sem-1-25-29-adm-form");

            default: // ❌ Failed
                console.log("❌ Payment Failed");
                appliedUser.paymentDetails = { ...paymentDetails, status: "failed" };
                await appliedUser.save();
                req.flash("flashMessage", ["Payment failed. Please try again.", "alert-danger"]);
                return res.redirect("/ug-reg-sem-1-25-29-adm-form");
        }

    } catch (error) {
        console.error("❌ Error in payResponse:", error);
        req.flash("flashMessage", ["Internal Server Error", "alert-danger"]);
        return res.status(500).redirect("/ug-reg-sem-1-25-29-adm-form");
    }
};



export const paymentSuccess = async (req, res) => {
    try {
        const user = await Ug_Reg_Sem_1_25_29_User.findById(req.id);
        const appliedUser = await Ug_reg_sem_1_25_29_adm_form.findOne({ appliedBy: user._id.toString() });

        if (!appliedUser) {
            req.flash("flashMessage", ["No admission form found for this user.", "alert-danger"]);
            return res.status(404).redirect("/ug-reg-sem-1-25-29-adm-form");
        }

        // Render success page with user and appliedUser details
        res.render("Ug_Reg_Sem_1_25_29/paymentSuccess", { user, payment: appliedUser.paymentDetails });

    } catch (error) {
        console.log("Error in Ug_Reg_Sem_1_25_29_Controller >> payment-Controller >> paymentSuccess", error);
        req.flash("flashMessage", ["Internal Server Error", "alert-danger"]);
        return res.status(500).redirect("/ug-reg-sem-1-25-29-adm-form");
    }
}