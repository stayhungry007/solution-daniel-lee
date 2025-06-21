import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { Context } from 'koa';
import { respond } from './responses';
import config  from '../../config';  // Secret for JWT

// Define the UserPayload interface explicitly
interface UserPayload {
  email: string;
  password: string;
}

// Define the Users object with appropriate methods
interface UsersMethods {
  register: (context: Context) => Promise<void>;
  login: (context: Context) => Promise<void>;
}

const Users: UsersMethods = {
  register: async (context: Context): Promise<void> => {
    const { email, password }: UserPayload = context.request.body as UserPayload;

    // Check if email and password are provided
    if (!email || !password) {
      return respond.badRequest(context, {
        email: 'Email is required',
        password: 'Password is required'
      });
    }

    try {
      // Check if email is already taken
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return respond.badRequest(context, {
          email: 'Email is already in use'
        });
      }

      // Hash password before saving it (handled by the model hook, but it's good to know)
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the new user (password will be hashed due to the model hook)
      const newUser = await User.create({ email, password: hashedPassword });

      // Respond with the user info (excluding password)
      respond.success(context, { email: newUser.email });
    } catch (error) {
      respond.badRequest(context, { message: error.message });
    }
  },

  login: async (context: Context): Promise<void> => {
    const { email, password }: UserPayload = context.request.body as UserPayload;

    // Check if email and password are provided
    if (!email || !password) {
      return respond.badRequest(context, {
        email: 'Email is required',
        password: 'Password is required'
      });
    }

    try {
      // Find the user by email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return respond.badRequest(context, { message: 'Invalid email or password' });
      }

      // Compare the entered password with the stored hash
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return respond.badRequest(context, { message: 'Invalid email or password' });
      }

      // Generate JWT token
      const token = jwt.sign({ email: user.email }, config.jwtSecret, { expiresIn: '1h' });

      // Respond with the JWT token
      respond.success(context, { token });
    } catch (error) {
      respond.badRequest(context, { message: error.message });
    }
  }
};

export default Users;
