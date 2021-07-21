const Sequelize = require("sequelize");
const db = require("../db");

const Message = db.define("message", {
  text: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  senderId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  readStatus: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

Message.findMessageById = async function (messageId) {
  const message = await Message.findOne({
    where: {
      id: messageId,
    },
  });

  return message;
};

module.exports = Message;
