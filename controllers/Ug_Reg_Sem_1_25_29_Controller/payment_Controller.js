import Ug_Reg_Sem_1_25_29_User from "../../models/Ug_Reg_Sem_1_25_29_Models/user.js"
import Ug_reg_sem_1_25_29_adm_form from "../../models/Ug_Reg_Sem_1_25_29_Models/adm_Form.js"
import { generateOrderId, billDeskFormattedDate, billDeskFormattedTimestamp } from "../../Utils/utils-function.js"
import jws from 'jws'
import axios from 'axios'
import { generateReceiptNumber } from "../../Utils/utils-function.js"

// Backup pay
import qrcode from 'qrcode'
import FileUpload from '../../fileUpload/fileUpload.js'

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

export const payGet = async (req, res) => {
    try {
        const user = await Ug_Reg_Sem_1_25_29_User.findById(req.id)
        const appliedUser = await Ug_reg_sem_1_25_29_adm_form.findOne({ appliedBy: user._id.toString() })

        qrcode.toDataURL(`upi://pay?pa=${process.env.UPI_ID}&am=${Number(appliedUser.admissionFee)}&tn=${appliedUser.studentName}`, function (err, src) {
            res.status(201).render('Ug_Reg_Sem_1_25_29/payPage', { "qrcodeUrl": src, user, appliedUser, "upiId": process.env.UPI_ID })
        })
    } catch (error) {
        console.log("Error in Ug_Reg_Sem_1_25_29_Controller >> payment-Controller >> payGet", error);
        req.flash("flashMessage", ["Something went wrong", "alert-danger"]);
        return res.status(500).redirect("/ug-reg-sem-1-25-29-adm-form");
    }
}

export const payPost = async (req, res) => {
    try {
        const { paymentId } = req.body
        const user = await Ug_Reg_Sem_1_25_29_User.findById(req.id)
        const appliedUser = await Ug_reg_sem_1_25_29_adm_form.findOne({ appliedBy: user._id.toString() })

        const existPaymentId = await Ug_reg_sem_1_25_29_adm_form.findOne({ paymentId })

        if (existPaymentId) {
            return qrcode.toDataURL(`upi://pay?pa=${process.env.UPI_ID}&am=${Number(appliedUser.admissionFee)}&tn=${appliedUser.studentName}`, function (err, src) {
                return res.status(201).render('Ug_Reg_Sem_1_25_29/payPage', {
                    "qrcodeUrl": src,
                    user,
                    appliedUser,
                    "upiId": process.env.UPI_ID,
                    invalid: "Please enter valid UTR / Ref no. (कृपया वैध यूटीआर/रेफ नंबर दर्ज करें।)"
                });
            });
        }


        const images = req.files

        // console.log(images[0].path);
        const photoUpload = await FileUpload(images[0].path)
        const paymentSSURL = photoUpload.secure_url
        // console.log(paymentSSURL);

        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const dateAndTimeOfPayment = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`

        let receiptNo = ""
        if (user.course === "Bachelor of Science") {
            receiptNo = generateReceiptNumber("BS", "SEM-1", generateOrderId());
        } else {
            receiptNo = generateReceiptNumber("BA", "SEM-1", generateOrderId());
        }

        //Test start
        // let collegeRollNo = "";

        // let Physics = await Ug_reg_sem_1_25_29_adm_form.find({ paper1: "Physics", isPaid: true })
        // let physicsCount = Physics.length
        // console.log("183", physicsCount)
        // let Chemistry = await Ug_reg_sem_1_25_29_adm_form.find({ paper1: "Chemistry", isPaid: true })
        // let ChemistryCount = Chemistry.length
        // console.log("186", ChemistryCount)
        // let Zoology = await Ug_reg_sem_1_25_29_adm_form.find({ paper1: "Zoology", isPaid: true })
        // let ZoologyCount = Zoology.length
        // console.log("189", ZoologyCount)
        // let Botany = await Ug_reg_sem_1_25_29_adm_form.find({ paper1: "Botany", isPaid: true })
        // let BotanyCount = Botany.length
        // console.log("192", BotanyCount)
        // let Mathematics = await Ug_reg_sem_1_25_29_adm_form.find({ paper1: "Mathematics", isPaid: true })
        // let MathematicsCount = Mathematics.length
        // console.log("195", MathematicsCount)

        // let totalSciStu = physicsCount + ChemistryCount + ZoologyCount + BotanyCount + MathematicsCount

        // // BA
        // let Economics = await Ug_reg_sem_1_25_29_adm_form.find({ paper1: "Economics", isPaid: true })
        // let EconomicsCount = Economics.length

        // let History = await Ug_reg_sem_1_25_29_adm_form.find({ paper1: "History", isPaid: true })
        // let HistoryCount = History.length

        // let PoliticalScience = await Ug_reg_sem_1_25_29_adm_form.find({ paper1: "Political Science", isPaid: true })
        // let PoliticalScienceCount = PoliticalScience.length

        // let Psychology = await Ug_reg_sem_1_25_29_adm_form.find({ paper1: "Psychology", isPaid: true })
        // let PsychologyCount = Psychology.length

        // let Sociology = await Ug_reg_sem_1_25_29_adm_form.find({ paper1: "Sociology", isPaid: true })
        // let SociologyCount = Sociology.length

        // let English = await Ug_reg_sem_1_25_29_adm_form.find({ paper1: "English", isPaid: true })
        // let EnglishCount = English.length

        // let Hindi = await Ug_reg_sem_1_25_29_adm_form.find({ paper1: "Hindi", isPaid: true })
        // let HindiCount = Hindi.length

        // let Urdu = await Ug_reg_sem_1_25_29_adm_form.find({ paper1: "Urdu", isPaid: true })
        // let UrduCount = Urdu.length

        // let Philosophy = await Ug_reg_sem_1_25_29_adm_form.find({ paper1: "Philosophy", isPaid: true })
        // let PhilosophyCount = Philosophy.length

        // let totalBAStu = EconomicsCount + HistoryCount + PoliticalScienceCount + PsychologyCount + SociologyCount + EnglishCount + HindiCount + UrduCount + PhilosophyCount

        // if (appliedUser.paper1 === "Physics" || appliedUser.paper1 === "Chemistry" || appliedUser.paper1 === "Zoology" || appliedUser.paper1 === "Botany" || appliedUser.paper1 === "Mathematics") {

        //     collegeRollNo = `BS${totalSciStu}`
        //     const existRollNo = await Ug_reg_sem_1_25_29_adm_form.findOne({ collegeRollNo })

        //     if (existRollNo != null) {
        //         collegeRollNo = `BS${Number(existRollNo.collegeRollNo.slice(2)) + 1}`
        //     } else {
        //         collegeRollNo = `BS${totalSciStu + 1}`
        //     }

        // } else {
        //     collegeRollNo = `BS${totalBAStu}`
        //     const existRollNo = await Ug_reg_sem_1_25_29_adm_form.findOne({ collegeRollNo })

        //     if (existRollNo != null) {
        //         collegeRollNo = `BA${Number(existRollNo.collegeRollNo.slice(2)) + 1}`
        //     } else {
        //         collegeRollNo = `BA${totalBAStu + 1}`
        //     }

        // }
        // Test

        // new test
        let collegeRollNo = "";

        // Define subject groups
        const sciSubjects = ["Physics", "Chemistry", "Zoology", "Botany", "Mathematics"];
        const baSubjects = ["Economics", "History", "Political Science", "Psychology", "Sociology", "English", "Hindi", "Urdu", "Philosophy"];

        // Fetch all paid forms grouped by paper1
        const allPaidForms = await Ug_reg_sem_1_25_29_adm_form.aggregate([
            { $match: { isPaid: true } },
            { $group: { _id: "$paper1", count: { $sum: 1 } } }
        ]);

        // Create a map of subject to count
        const subjectCountMap = {};
        allPaidForms.forEach(item => {
            subjectCountMap[item._id] = item.count;
        });

        // Count total students
        const totalSciStu = sciSubjects.reduce((sum, sub) => sum + (subjectCountMap[sub] || 0), 0);
        const totalBAStu = baSubjects.reduce((sum, sub) => sum + (subjectCountMap[sub] || 0), 0);

        // Generate roll number
        const isScience = sciSubjects.includes(appliedUser.paper1);

        if (isScience) {
            collegeRollNo = `BS${totalSciStu + 1}`;
        } else {
            collegeRollNo = `BA${totalBAStu + 1}`;
        }

        // Ensure uniqueness
        const existRollNo = await Ug_reg_sem_1_25_29_adm_form.findOne({ collegeRollNo });

        if (existRollNo) {
            const prefix = isScience ? "BS" : "BA";
            const lastNumber = parseInt(existRollNo.collegeRollNo.slice(2), 10);
            collegeRollNo = `${prefix}${lastNumber + 1}`;
        }

        // new test
        await Ug_reg_sem_1_25_29_adm_form.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { paymentSS: paymentSSURL, dateAndTimeOfPayment, paymentId, isPaid: true, receiptNo, collegeRollNo } })

        res.redirect("/ug-reg-sem-1-25-29/payment/payment-success")
    } catch (error) {
        console.log("Error in Ug_Reg_Sem_1_25_29_Controller >> payment-Controller >> payPost", error);
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
                appliedUser.receiptNo = generateReceiptNumber(appliedUser.collegeRollNo, "SEM-1", orderid);
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
        res.render("Ug_Reg_Sem_1_25_29/paymentSuccess", { user, appliedUser, payment: appliedUser.paymentDetails });

    } catch (error) {
        console.log("Error in Ug_Reg_Sem_1_25_29_Controller >> payment-Controller >> paymentSuccess", error);
        req.flash("flashMessage", ["Internal Server Error", "alert-danger"]);
        return res.status(500).redirect("/ug-reg-sem-1-25-29-adm-form");
    }
}