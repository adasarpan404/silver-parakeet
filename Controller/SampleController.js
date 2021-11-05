const multer = require('multer')
const sharp = require('sharp')
const Sample = require('./../Model/BotanicalModel')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../Utils/AppError')
const factory = require('./HandleFactory')

const multerStorage = multer.memoryStorage();
