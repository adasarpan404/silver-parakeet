const express = require('express')
const sampleController = require('./../Controller/SampleController')
const authController = require('./../Controller/AuthController')
const router = express.Router();

router.route('/').get(sampleController.getAllSample).post(authController.protect, sampleController.createSample);
router.route('/:id').get(sampleController.getSample).patch(authController.protect, sampleController.updateSample).delete(authController.protect, sampleController.deleteSample);
module.exports = router;