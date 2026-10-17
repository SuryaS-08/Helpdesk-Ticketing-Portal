const express = require("express");
const { authenticate, requireRole } = require("../middleware/auth");
const { getUsers } = require("../controllers/userController");

const router = express.Router();

router.use(authenticate);
router.get("/", requireRole("admin"), getUsers);

module.exports = router;
