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
    const user = await User.findOne({email}).select('+password');
    if(!user || !(await user.correctPassword(password, user.password))){
        return next(new AppError('Incorrect email or password', 401))
    }
    createSendToken(user, 200, req, res);
})

exports.protect = catchAsync(async(req, res, next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }else if(req.cookies.jwt){
        token = req.cookies.jwt;
    }
    if(!token){
        return next(
            new AppError('You are not logged in! Please log in again', 401)
        )
    }
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);
    if(!currentUser){
        return next(
            new AppError(
                'The user belonging to this token does not exist',
                401
            )
        )
    }
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
})