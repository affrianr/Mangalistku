'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class List extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      List.belongsTo(models.User, {foreignKey: 'UserId'})
    }
  }
  List.init({
    title: {
      type: DataTypes.STRING,
      allowNull: true,
      // validate: {
      //   notEmpty: {
      //     msg: `Title is required`
      //   },
      //   notNull: {
      //     msg: `Title is required`
      //   }
      // }
    },
    mangaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: `Manga ID is required`
        },
        notNull: {
          msg: `Manga ID is required`
        }
      }
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      // validate: {
      //   notEmpty: {
      //     msg: `Image is required`
      //   },
      //   notNull: {
      //     msg: `Image is required`
      //   }
      // }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
      // validate: {
      //   notEmpty: {
      //     msg: `Type of manga is required`
      //   },
      //   notNull: {
      //     msg: `Type of manga is required`
      //   }
      // }
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: `User ID is required`
        },
        notNull: {
          msg: `User ID is required`
        }
      }
    }
  }, {
    sequelize,
    modelName: 'List',
  });
  return List;
};