import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from './connection'; // Your DB connection

// Define the attributes interface
interface IssueAttributes {
  id: number;
  title: string;
  description: string;
  created_by: string;
  updated_by: string;
  created_at: Date;
  updated_at: Date;
}

// Define the creation attributes interface
interface IssueCreationAttributes extends Optional<IssueAttributes, 'id' | 'created_at' | 'updated_at'> {}

class Issue extends Model<IssueAttributes, IssueCreationAttributes> implements IssueAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public created_by!: string;
  public updated_by!: string;
  public created_at!: Date;
  public updated_at!: Date;
}

// Initialize the model with explicit fields
Issue.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id',
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'unknown',  // Optional default value
    },
    updated_by: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'unknown',  // Optional default value
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,  // Automatically set current timestamp
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,  // Automatically set current timestamp
    },
  },
  {
    sequelize,
    tableName: 'issues',
    timestamps: false,  // Disable Sequelize's automatic timestamps because we're handling them manually
  }
);

export { Issue };
