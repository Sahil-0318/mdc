import BCA_2_24_27_User from "../../models/userModel/BCA_2_24_27_Model/user_Model.js";
import BCA_2_24_27_Form from "../../models/userModel/BCA_2_24_27_Model/form_Model.js";
import { generateOrderId } from "../../Utils/utils-function.js"
import { generateReceiptNumber } from "../../Utils/utils-function.js"

// Backup pay
import qrcode from 'qrcode'
import FileUpload from '../../fileUpload/fileUpload.js'

export const checkoutPage = async (req, res) => {
    try {
        const user = await BCA_2_24_27_User.findById(req.id)
        const appliedUser = await BCA_2_24_27_Form.findOne({ appliedBy: user._id.toString() })

        res.render('BCA_2_24_27/checkoutPage', { user, appliedUser })
    } catch (error) {
        console.log("Error in BCA_2_24_27_Controller >> payment-Controller >> checkoutPage", error);
        req.flash("flashMessage", ["Something went wrong", "alert-danger"]);
        return res.status(500).redirect("/bca-2-24-27-adm-form");
    }
}

export const payGet = async (req, res) => {
    try {
        const user = await BCA_2_24_27_User.findById(req.id)
        const appliedUser = await BCA_2_24_27_Form.findOne({ appliedBy: user._id.toString() })

        qrcode.toDataURL(`upi://pay?pa=${process.env.VOC_UPI_ID}&am=${Number(appliedUser.admissionFee)}&tn=${appliedUser.studentName}`, function (err, src) {
            res.status(201).render('BCA_2_24_27/payPage', { "qrcodeUrl": src, user, appliedUser, "upiId": process.env.VOC_UPI_ID })
        })
    } catch (error) {
        console.log("Error in BCA_2_24_27_Controller >> payment-Controller >> payGet", error);
        req.flash("flashMessage", ["Something went wrong", "alert-danger"]);
        return res.status(500).redirect("/bca-2-24-27-adm-form");
    }
}

export const payPost = async (req, res) => {
    try {
        const { paymentId } = req.body
        const user = await BCA_2_24_27_User.findById(req.id)
        const appliedUser = await BCA_2_24_27_Form.findOne({ appliedBy: user._id.toString() })

        const existPaymentId = await BCA_2_24_27_Form.findOne({ paymentId })

        if (existPaymentId) {
            return qrcode.toDataURL(`upi://pay?pa=${process.env.VOC_UPI_ID}&am=${Number(appliedUser.admissionFee)}&tn=${appliedUser.studentName}`, function (err, src) {
                return res.status(201).render('BCA_2_24_27/payPage', {
                    "qrcodeUrl": src,
                    user,
                    appliedUser,
                    "upiId": process.env.VOC_UPI_ID,
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

        let receiptNo = generateReceiptNumber("BCA", "PART-2", generateOrderId());

        await BCA_2_24_27_Form.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { paymentSS: paymentSSURL, dateAndTimeOfPayment, paymentId, isPaid: true, receiptNo } })

        res.redirect("/bca-2-24-27/payment/payment-success")
    } catch (error) {
        console.log("Error in BCA_2_24_27_Controller >> payment-Controller >> payPost", error);
        req.flash("flashMessage", ["Something went wrong", "alert-danger"]);
        return res.status(500).redirect("/bca-2-24-27-adm-form");
    }
}

export const paymentSuccess = async (req, res) => {
    try {
        const user = await BCA_2_24_27_User.findById(req.id);
        const appliedUser = await BCA_2_24_27_Form.findOne({ appliedBy: user._id.toString() });

        if (!appliedUser) {
            req.flash("flashMessage", ["No admission form found for this user.", "alert-danger"]);
            return res.status(404).redirect("/bca-2-24-27-adm-form");
        }

        // Render success page with user and appliedUser details
        res.render("BCA_2_24_27/paymentSuccess", { user, appliedUser, payment: appliedUser.paymentDetails });

    } catch (error) {
        console.log("Error in BCA_2_24_27_Controller >> payment-Controller >> paymentSuccess", error);
        req.flash("flashMessage", ["Internal Server Error", "alert-danger"]);
        return res.status(500).redirect("/bca-2-24-27-adm-form");
    }
}