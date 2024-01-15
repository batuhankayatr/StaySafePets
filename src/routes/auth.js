const express = require('express');
const Auth = require('../models/Auth.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import the jsonwebtoken library
const crypto = require('crypto');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');


router.post('/register', async (req, res) => {
    try {
        const {name, email, password, phoneNumber, role, city } = req.body;
        const user = await Auth.findOne({ email });
        if (user) {
            return res.status(409).json({ success: false, error: 'User already exists' });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long' });
        }

        const passwordHash = await bcrypt.hash(password, 12);
        const newUser = await Auth.create({ name, email, password: passwordHash, phoneNumber, role, city });

        // Generate a token
        const token = jwt.sign({ userId: newUser._id }, uuidv4(), { expiresIn: '1h' });
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
        });
    } catch (error) {
        console.log(req.body)
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
router.post('/login', async(req , res) =>{
    try{
        const {email , password} = req.body;
        const user = await Auth.findOne({email});
        if(!user){
            return res.status(401).json({success : false , error : 'User does not exist'});
        }
        const isMatch = await bcrypt.compare(password , user.password);
        if(!isMatch){
            return res.status(401).json({success : false , error : 'Incorrect password'})
        }
        const token = jwt.sign({ userId: user._id }, uuidv4(), { expiresIn: '1h' });
        res.status(200).json({
            success: true,
            token
        });


    }

    catch{
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
    }
);
// Kullanıcının şifresini güncelleyen endpoint
router.post('/change-password', async (req, res) => {
    try {
        const { email, currentPassword, newPassword } = req.body;

        const user = await Auth.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Incorrect current password' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, error: 'New password must be at least 6 characters long' });
        }

        const newPasswordHash = await bcrypt.hash(newPassword, 12);
        user.password = newPasswordHash;

        await user.save();

        
        res.status(200).json({
            success: true,
            message: 'Password updated successfully',
            
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

module.exports = router;
