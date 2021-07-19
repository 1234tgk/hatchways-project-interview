const router = require("express").Router();
const { User, Conversation, Message } = require("../../db/models");
const { Op } = require("sequelize");
const onlineUsers = require("../../onlineUsers");

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
// TODO: for scalability, implement lazy loading
router.get("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: {
          user1Id: userId,
          user2Id: userId,
        },
      },
      attributes: [
        "id",
        "totalMessageCount",
        "user1ReadCount",
        "user2ReadCount",
      ],
      order: [[Message, "createdAt", "ASC"]],
      include: [
        { model: Message, order: ["createdAt", "ASC"] },
        {
          model: User,
          as: "user1",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
        {
          model: User,
          as: "user2",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
      ],
    });

    conversations.sort(
      (convo1, convo2) =>
        convo2.messages[convo2.messages.length - 1].createdAt -
        convo1.messages[convo1.messages.length - 1].createdAt
    );

    for (let i = 0; i < conversations.length; i++) {
      const convo = conversations[i];
      const convoJSON = convo.toJSON();

      // set a property "otherUser" so that frontend will have easier access
      if (convoJSON.user1) {
        convoJSON.otherUser = convoJSON.user1;
        delete convoJSON.user1;
      } else if (convoJSON.user2) {
        convoJSON.otherUser = convoJSON.user2;
        delete convoJSON.user2;
      }

      // set property for online status of the other user
      if (onlineUsers.includes(convoJSON.otherUser.id)) {
        convoJSON.otherUser.online = true;
      } else {
        convoJSON.otherUser.online = false;
      }

      // set properties for notification count and latest message preview
      convoJSON.latestMessageText =
        convoJSON.messages[convoJSON.messages.length - 1].text;
      conversations[i] = convoJSON;
    }

    res.json(conversations);
  } catch (error) {
    next(error);
  }
});

// update the selected convo (by Id) the selected user's read count
// no body! (wow)
router.post("/:id", async (req, res, next) => {
  try {
    // check if user is there
    if (!req.user) {
      return res.sendStatus(401);
    }
    // req.user.id == current user's id

    const { id } = req.params; // convo id

    let conversation = await Conversation.findConversationById(id);

    // check prohibited accesss
    if (
      conversation.user1Id !== req.user.id &&
      conversation.user2Id !== req.user.id
    ) {
      return res.sendStatus(403);
    }

    // check which user (user1 or user2) is the logged in user,
    // update the corresponding read count
    if (conversation.user1Id === req.user.id) {
      conversation.user1ReadCount = conversation.totalMessageCount;
    } else {
      conversation.user2ReadCount = conversation.totalMessageCount;
    }

    await conversation.save();

    conversation.userId = req.user.id;

    res.json(conversation);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    // check if user is there
    if (!req.user) {
      return res.sendStatus(401);
    }
    // req.user.id == current user's id

    const { id } = req.params; // convo id

    let conversation = await Conversation.findConversationById(id);

    res.json(conversation);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
