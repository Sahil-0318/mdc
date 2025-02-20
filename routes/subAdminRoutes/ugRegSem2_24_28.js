import express from 'express'
const ugRegSem2_24_28_Router = express.Router()
import multer from 'multer'

import { subAdminAuth } from '../../Utils/utils-function.js'

import { subAdminPage, ugRegSem2_24_28_AdmForm, ugRegSem2_24_28_AdmFormPost, ugRegularSem_2_24_28_Pay, ugRegularSem_2_24_28_PayPost, ugRegularSem_2_24_28_Receipt, ugRegularSem_2_24_28_Form, subAdminPageLogout } from '../../controllers/subAdminControllers/ugRegSem2_24_28.js'

const storage = multer.diskStorage({})
  
const upload = multer({
    storage: storage
    // limits: {fileSize: 100000}
})

ugRegSem2_24_28_Router.get('/subAdminPage', subAdminAuth, subAdminPage)

ugRegSem2_24_28_Router.get('/ugRegSem2-24-28-AdmForm', subAdminAuth, ugRegSem2_24_28_AdmForm)

ugRegSem2_24_28_Router.post('/ugRegSem2-24-28-AdmForm', subAdminAuth, upload.array('studentPhoto'), ugRegSem2_24_28_AdmFormPost)

ugRegSem2_24_28_Router.get('/ugRegularSem-2-24-28-Pay/:uniRegNumber', subAdminAuth, ugRegularSem_2_24_28_Pay)

ugRegSem2_24_28_Router.post('/ugRegularSem-2-24-28-Pay/:uniRegNumber', subAdminAuth, ugRegularSem_2_24_28_PayPost)

ugRegSem2_24_28_Router.get('/ugRegularSem-2-24-28-Receipt/:uniRegNumber', subAdminAuth, ugRegularSem_2_24_28_Receipt)

ugRegSem2_24_28_Router.get('/ugRegularSem-2-24-28-Form/:uniRegNumber', subAdminAuth, ugRegularSem_2_24_28_Form)

ugRegSem2_24_28_Router.get('/subAdminPageLogout', subAdminAuth, subAdminPageLogout)

export default ugRegSem2_24_28_Router