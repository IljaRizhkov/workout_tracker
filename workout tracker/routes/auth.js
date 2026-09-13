//Define authentication endpoints

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

//Register User
router.post('/register', async (req, res) => {
    const {username, email, password} = req.body;

    try {
        //expeptions 
        if (!username || !email || !password) {
            return res.status(400).json({message: 'All fields are required'});        
        }

        const userExists = await User.findOne({email});
        if (userExists) {
            return res.status(400).json({message: 'User aleadey exists'});
        }

        //1. hash password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        //2. save user with hashed password
        const newUser = await User.create({ 
            username,
            email,
            password: hashedPassword
        });

        //3. send response without password into JSON
        res.status(201).json({
            message: 'User registered successfully' ,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        });

    } catch (err) {
        res.status(500).json({message: 'Server Error', error: err.message });
    }
});

//Login User
router.post('/login', async (req, res) => {
    const {email, password} = req.body;

    try{
        const user = await User.findOne ({email});
        if (!user) {
            return res.status(400).json({message: 'User does not exist'});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id} , process.env.JWT_SECRET, {expiresIn: '1h' });
        res.status(200).json({message: 'Login successful', token});

    } catch (err) {
        res.status(500).json({message: 'Server Error'});
    }
});


module.exports = router;

