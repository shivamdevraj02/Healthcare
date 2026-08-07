const router = require("express").Router();
const { sendMessage } = require("../controllers/chatbotController");

// Public route — no auth required, so it also works on the landing/login page.
router.post("/message", sendMessage);

module.exports = router;