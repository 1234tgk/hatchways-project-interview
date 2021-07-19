const Sequelize = require("sequelize");
const { Op } = Sequelize;
const db = require("../db");
const Message = require("./message");

const Conversation = db.define("conversation", {
  totalMessageCount: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  user1ReadCount: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  user2ReadCount: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

// find conversation given the conversation id

Conversation.findConversationById = async function (conversationId) {
  const conversation = await Conversation.findOne({
    where: {
      id: conversationId,
    },
  });

  return conversation;
};

module.exports = Conversation;
