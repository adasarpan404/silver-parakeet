const crypto = require('crypto')
const {promisify} = require('util')
const jwt = require('jsonwebtoken')
const User = require('./../Model/UserModel')
const catchAsync = require('./../Utils/catchAsync')
const AppError = require('./../Utils/AppError')
const signToken = id => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}
const createSendToken = (user, statusCode, req, res)=>{
    const token = signToken(user._id);
    res.cookie('jwt', token, {
        expires: new Date(
            Date.now()+process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true, 
        secure: req.secure || req.headers['x-forwarded-proto'] === 'proto'
    });
    user.password = undefined;
    res.status(statusCode).json({
        status: 'success', 
        token, 
        data: {
            user
        }
    });
}
exports.signup = catchAsync(async(req, res, next)=>{
    const newUser = await User.create({
        name: req.body.name, 
        email: req.body.email, 
        password: req.body.password, 
        passwordConfirm: req.body.passwordConfirm
    })
    createSendToken(newUser, 201, req, res);
})
exports.login = catchAsync(async(req, res, next)=>{
    const {email, password} = req.body;
    if(!email || !password){
        return next(new AppError('Please provide email and password'))
    }
    const user = awa
})