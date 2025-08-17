import express from 'express'

const gallery_Admin_Route = express.Router()
import { upload } from '../../../middlewares/mediaMiddleware.js'

import { adminAuth } from '../../../middlewares/adminMiddleware.js'

import { imageGallery, imageGalleryPost, deleteGalleryImage } from '../../../controllers/Admin_Controllers/Admin_Controller/galleryController.js'

gallery_Admin_Route.get("/admin/image-gallery", adminAuth, imageGallery)

gallery_Admin_Route.post("/admin/image-gallery", adminAuth, upload.array("images"), imageGalleryPost)

gallery_Admin_Route.post("/admin/image-gallery/delete/:id", adminAuth, deleteGalleryImage)

export default gallery_Admin_Route