import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import sequelize from './connection'; // Your DB connection
import bcrypt from 'bcryptjs';

// Define types for the model
interface UserAttributes {
  id: number;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'created_at' | 'updated_at'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public password!: string;
  public created_at!: Date;
  public updated_at!: Date;

  // Method to hash password before creating or updating the user
  static hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
  };

  // Method to validate if password is correct (for login)
  static validatePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id',
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW, // Automatically set current timestamp
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW, // Automatically set current timestamp
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      // Hash password before creating a new user
      beforeCreate: async (user: User): Promise<void> => {
        user.password = await User.hashPassword(user.password);
      },
      // Hash password before updating a user's password
      beforeUpdate: async (user: User): Promise<void> => {
        if (user.changed('password')) {
          user.password = await User.hashPassword(user.password);
        }
      },
    },
  }
);

export { User };
