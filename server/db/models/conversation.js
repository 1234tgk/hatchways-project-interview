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

// find conversation given two user Ids

Conversation.findConversation = async function (user1Id, user2Id) {
  const conversation = await Conversation.findOne({
    where: {
      user1Id: {
        [Op.or]: [user1Id, user2Id],
      },
      user2Id: {
        [Op.or]: [user1Id, user2Id],
      },
    },
  });

  // return conversation or null if it doesn't exist
  return conversation;
};

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
