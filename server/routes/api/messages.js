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
    let conversation = await Conversation.findConversation(
      senderId,
      recipientId
    );

    // if convo is null but sender is not trying to create new convo (by checking if sender is null),
    // send 401 status since it is unauthorized
    if (!conversation && !sender) {
      return res.sendStatus(401);
    }

    // if convo is not null (convo between sender(current user) and recipient is found), but
    // the convoId is not equals to the convo we found, send 401 status since it is unauthorized
    if (conversation && conversation.dataValues.id !== conversationId) {
      return res.sendStatus(401);
    }

    // if we already know conversation id, we can save time and just add it to message and return
    // make sure if conversation is not null
    if (conversation && conversationId) {
      const message = await Message.create({ senderId, text, conversationId });
      return res.json({ message, sender });
    }

    if (!conversation) {
      // if sender.id does not match with senderId, send 401
      if (sender.id !== senderId) {
        return res.sendStatus(401);
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
      conversationId: conversation.id,
    });
    res.json({ message, sender });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
