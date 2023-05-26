const jwt = require("jsonwebtoken");
const Register = require("../modal/registerSchema/");

const auth = async (req, res, next) => {
  try {
    const token=req.cookies.jwt;
    let verify_user=jwt.verify(token,"HelloWorldhere");
    const user=await Register.findOne({_id:verify_user._id})
    req.token=token;
    req.user=user;
    next();
  } catch (err) {
    res.status(404).send(err);
  }
};
module.exports=auth