import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from './connection'; // Your DB connection

interface RevisionAttributes {
  id: number;
  issue_id: number;
  changes: object;
  updated_by: string;
  created_at: Date;
  updated_at: Date;
}

interface RevisionCreationAttributes extends Optional<RevisionAttributes, 'id' | 'created_at' | 'updated_at'> {}

class Revision extends Model<RevisionAttributes, RevisionCreationAttributes> implements RevisionAttributes {
  public id!: number;
  public issue_id!: number;
  public changes!: object;
  public updated_by!: string;
  public created_at!: Date;
  public updated_at!: Date;
}

Revision.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id',
    },
    issue_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    changes: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    updated_by: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,  // Automatically set to the current time
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,  // Automatically set to the current time
    },
  },
  {
    sequelize,
    tableName: 'revisions',
    timestamps: false,  // Disable automatic timestamps
  }
);

export { Revision };
