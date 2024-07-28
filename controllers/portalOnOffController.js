import User from '../models/userModel/userSchema.js'
import PortalOnOff from '../models/adminModel/portalOnOffSchema.js'

const ugRegularPart3Potal202225 = async (req, res) => {
    try {
        let queries = req.query
        const user = await User.findOne({ _id: req.id })

        if (queries.isOn === "true") {
            await PortalOnOff.findOneAndUpdate({portal : "ugRegularPart3_22-25"}, { $set : {isOn : false} })
        }  

        if (queries.isOn === "false") {
            await PortalOnOff.findOneAndUpdate({portal : "ugRegularPart3_22-25"}, { $set : {isOn : true} })
        }

        const portal = await PortalOnOff.findOne({portal : "ugRegularPart3_22-25"})
        res.render('portalOnOff', { user, portal : portal.isOn })
    } catch (error) {
        console.log("Error in UG Regular Part3 Potal 2022-25 Get Method =====>", error)
    }
}


export {
    ugRegularPart3Potal202225
}