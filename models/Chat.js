

module.exports = function(sequelize, DataTypes) {
  const Chat = sequelize.define('Chat', {
    message: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      } 
    }

  });

  Chat.associate = function(models) {
    Chat.belongsTo(models.User), {
      foreignKey: {
        allowNull: false
      }
    };
  };

  return Chat;
};
