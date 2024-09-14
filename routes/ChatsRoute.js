const express = require("express");
const decodeToken = require("../middlewares/decodeToken");
const UserSchema = require("../models/UserSchema");
const ContactsSchema = require("../models/ContactsSchema");
const ChatSchema = require("../models/ChatSchema");
const router = express();

router.post("/add", decodeToken, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({
        success: false,
        error: "User email is required.",
      });

    const existingUser = await UserSchema.findOne({ email });
    if (!existingUser)
      return res.status(404).json({
        success: false,
        error: "User is not registered on Raahi Beats.",
      });

    let contact = await ContactsSchema.findOne({
      email: existingUser.email,
      user: req.user,
    });

    if (contact)
      return res.status(200).json({
        success: false,
        error: "Contact is already saved in your contacts list.",
      });

    contact = new ContactsSchema({
      username: existingUser.username,
      email: existingUser.email,
      avatar: existingUser.avatar,
      user: req.user,
    });
    const savedContact = await contact.save();

    if (!savedContact)
      return res.status(500).json({
        success: false,
        error: "Some error occured while adding the contact.",
      });

    res.status(200).json({
      success: true,
      message: "Contact added successfully.",
      contact,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Some error occured while adding the contact.",
    });
  }
});

router.get("/get", decodeToken, async (req, res) => {
  try {
    const contacts = await ContactsSchema.find({ user: req.user });
    res.status(200).json({ success: true, contacts });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Some error occured while adding the contact.",
    });
  }
});

router.delete("/delete", decodeToken, async (req, res) => {
  try {
    const contact = await ContactsSchema.findById(req.body.contactID);
    if (!contact)
      return res.status(400).json({
        success: false,
        error: "Contact does not exist.",
      });
    if (contact.user.toString() !== req.user.toString()) {
      return res.status(400).json({
        success: false,
        error: "Unauthorized access is denied.",
      });
    }
    const deletedContact = await ContactsSchema.findByIdAndDelete(
      req.body.contactID
    );
    if (!deletedContact) {
      return res.status(500).json({
        success: false,
        error: "Some error occured while adding the contact.",
      });
    }
    res.status(200).json({
      success: true,
      message: "Contact deleted successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Some error occured while adding the contact.",
    });
  }
});

router.post("/get/messages", decodeToken, async (req, res) => {
  try {
    const { contactEmail } = req.body;
    if (!contactEmail)
      return res
        .status(400)
        .json({ success: false, error: "Contact Email is required." });
    const user = await ChatSchema.findOne({
      user: req.user,
    });
    const filteredMessages = user.messages.filter(
      (currMessage) => currMessage.senderEmail === contactEmail
    );
    res.status(200).json({ success: true, messages: filteredMessages });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }
});
router.use((err, req, res, next) => {
  if (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }
  next();
});

module.exports = router;
