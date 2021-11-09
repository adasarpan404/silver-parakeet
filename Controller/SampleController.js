const multer = require('multer')
const sharp = require('sharp')
const Sample = require('./../Model/BotanicalModel')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../Utils/AppError')
const factory = require('./HandleFactory')

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images', 400))
    }
}
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadSamplePhoto = upload.single('image')

exports.resizeSamplePhoto = catchAsync(async (req, res, next) => {

    if (!req.file) return next();
    req.file.filename = `sample-${req.user.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 89 })
        .toFile(`public/img/sample/${req.file.filename}`);
    next();
})

exports.createSample = catchAsync(async (req, res, next) => {
    if (req.file) req.body.image = req.file.filename;
    
    const doc = await Sample.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            data: doc
        }
    })
})

exports.getAllSample = factory.getAll(Sample);
exports.getSample = factory.getOne(Sample);
exports.updateSample = factory.updateOne(Sample);
exports.deleteSample = factory.deleteOne(Sample);