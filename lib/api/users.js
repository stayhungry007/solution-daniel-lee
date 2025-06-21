const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { User } = require('../models');
const config = require('../config');  // Secret for JWT
const respond = require("./responses");


Users.register = async (context) => {
    const { email, password } = context.request.body;

    // Check if email and password are provided
    if (!email || !password) {
        return respond.badRequest(context, 'Email and password are required');
    }

    try {
        // Check if email is already taken
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return respond.badRequest(context, 'Email is already in use');
        }

        // Create the new user (password will be hashed due to the model hook)
        const newUser = await User.create({ email, password });

        // Respond with the user info (excluding password)
        respond.success(context, { email: newUser.email });
    } catch (error) {
        respond.badRequest(context, error.message);
    }
};

Users.login = async (context) => {
    const { email, password } = context.request.body;

    // Check if email and password are provided
    if (!email || !password) {
        return respond.badRequest(context, 'Email and password are required');
    }

    try {
        // Find the user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return respond.badRequest(context, 'Invalid email or password');
        }

        // Compare the entered password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return respond.badRequest(context, 'Invalid email or password');
        }

        // Generate JWT token
        const token = jwt.sign({ email: user.email }, config.jwtSecret, { expiresIn: '1h' });

        // Respond with the JWT token
        respond.success(context, { token });
    } catch (error) {
        respond.badRequest(context, error.message);
    }
};
