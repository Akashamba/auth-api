const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {registerValidation, loginValidation} = require('../validation');



router.post('/register', async (req, res) => {

    //  LETS VALIDATE THE DATA
    const { error } = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // If no error, Check if user already exists in database
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send("Email already exists");

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);


    // If user doesn't exist, Create new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try {
        const savedUser = await user.save();
        res.send({user: user._id});
    }catch(err){
        res.status(400).send(err);
        console.log(err)
    }
});

// Login
router.post('/login', async (req, res) => {
    //  LETS VALIDATE THE DATA
    const { error } = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // If no error, Check if user exists in database
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send("Email not found");

    // If user exists, check if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send("Invalid Password")

    // Create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
});

module.exports = router;