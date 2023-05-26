const router = require("express").Router();
const {
  register,
  login,
  logout,
  user,
  GoogleSignIn,
  getAlluser
} = require("../controllers/userController");
const auth = require("../middleware/auth");
router.post("/register", register);
router.post("/login", login);
router.get("/logout", auth, logout);
router.post("/googlesignin", GoogleSignIn);
router.get("/user", auth, user);
router.get("/getalluser",getAlluser);


module.exports = router;