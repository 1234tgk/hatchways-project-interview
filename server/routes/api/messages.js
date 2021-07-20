const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
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
      if (onlineUsers.includes(sender.id)) {
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

module.exports = router;
