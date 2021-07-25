const router = require("express").Router();
const { User, Conversation, Message } = require("../../db/models");
const { Op } = require("sequelize");
const onlineUsers = require("../../onlineUsers");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;

    // find the conversation
    let conversation = await Conversation.findConversationById(conversationId);

    // do this if conversation has been found
    if (conversation) {
      const { user1Id, user2Id } = conversation.dataValues;
      // if user1Id or user2Id does not match senderId nor recipientId, throw unauthorized
      if (
        (user1Id !== senderId && user1Id !== recipientId) ||
        (user2Id !== senderId && user2Id !== recipientId)
      ) {
        return res.sendStatus(403);
      }
      // add the message since there is no problem
      const message = await Message.create({
        senderId,
        text,
        readStatus: false,
        conversationId,
      });
      return res.json({
        message,
        sender,
      });
    }

    if (!conversation) {
      // if sender is null, we have prohibited request
      // if sender.id does not match with senderId, send 403
      if (!sender || sender.id !== senderId) {
        return res.sendStatus(403);
      }
      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });
      if (onlineUsers.has(sender.id)) {
        sender.online = true;
      }
    }
    const message = await Message.create({
      senderId,
      text,
      readStatus: false,
      conversationId: conversation.id,
    });
    res.json({
      message,
      sender,
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:conversationId", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }

    const userId = req.user.id;
    const conversationId = req.params.conversationId;

    await Message.update(
      { readStatus: true },
      {
        where: {
          [Op.and]: {
            conversationId: conversationId,
            senderId: {
              [Op.not]: userId,
            },
          },
        },
      }
    );

    let conversation = await Conversation.findOne({
      where: {
        id: conversationId,
      },
      attributes: ["id"],
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

    const convoJSON = conversation.toJSON();

    // set a property "otherUser" so that frontend will have easier access
    if (convoJSON.user1) {
      convoJSON.otherUser = convoJSON.user1;
      delete convoJSON.user1;
    } else if (convoJSON.user2) {
      convoJSON.otherUser = convoJSON.user2;
      delete convoJSON.user2;
    }

    // set property for online status of the other user
    if (onlineUsers.has(convoJSON.otherUser.id)) {
      convoJSON.otherUser.online = true;
    } else {
      convoJSON.otherUser.online = false;
    }

    // set properties for notification count and latest message preview
    convoJSON.latestMessageText =
      convoJSON.messages[convoJSON.messages.length - 1].text;
    conversation = convoJSON;

    res.status(200).json(conversation);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
