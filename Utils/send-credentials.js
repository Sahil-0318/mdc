import unirest from 'unirest'

export const sendCredentialsOnMobile = async (userId, password, mobileNumber) => {
    try {
        var req = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");

        req.headers({
            "authorization": process.env.FAST2SMS_API
        });

        req.form({
            "sender_id": process.env.DLT_USER_PSSWORD_SENDER_ID,
            "message": process.env.YOUR_USER_PSSWORD_MESSAGE_ID,
            "variables_values": `${userId}|${password}`,
            "route": "dlt",
            "numbers": mobileNumber,
        });

        req.end(function (res) {
            if (res.error) {
                console.error('Request error:', res.error);
                return; // Exit the function if there's an error
            }

            if (res.status >= 400) {
                console.error('Error response:', res.status, res.body);
                return; // Exit the function if the response status code indicates an error
            }

            console.log('Success:', res.body);
        });
    } catch (error) {

    }
}