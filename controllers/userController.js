const registerSchema = require("../modal/registerSchema");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.G_ClientID);
module.exports = {
  register: async (req, res) => {
    const joiSchema = Joi.object({
      username: Joi.string().alphanum().min(3).max(30).required(),
      email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "in"] },
      }),
      password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
      confirm_password: Joi.ref("password"),
      contact: Joi.string()
        .length(10)
        .pattern(/^[0-9]+$/)
        .required(),
    });
    const { error } = joiSchema.validate(req.body);
    if (error) {
      return res
        .status(409)
        .json({ message: "something went wrong", err: error });
    }
    try {
      const emailchecker = await registerSchema.exists({
        email: req.body.email,
      });
      if (emailchecker) {
        return res.status(409).json({ message: "email already present" });
      }
      let { username, password, confirm_password, contact, email } = req.body;
      const user = { username, password, confirm_password, contact, email };
      const userData = await new registerSchema(user);
      const token = await userData.generateAuthToken();
      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 3000),
        httpOnly: true,
      });
      await userData.save();
      return res.status(201).json({ msg: "user registered" });
    } catch (err) {
      return res
        .status(409)
        .json({ message: "something went wrong", err: err });
    }
  },
  login: async (req, res) => {
    try {
      let joivalidation = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
      });
      const { error } = joivalidation.validate(req.body);
      if (error) {
        return res.status(204).json({ msg: "something went wrong" });
      }
      let result = await registerSchema.findOne({ email: req.body.email });
      let token;
      if (result.tokens[0].token) {
        token = result.tokens[0].token;
      } else {
        token = await result.generateAuthToken();
      }
      const isMatch = await bcrypt.compare(req.body.password, result.password);
      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 300000),
        httpOnly: true,
      });

      if (isMatch) {
        return res.status(200).json({ msg: "login successfully" });
      } else {
        return res.status(500).json({ msg: "invalid login detail" });
      }
    } catch (error) {
      return res.status(400).json({ msg: "invalid login detail" });
    }
  },
  logout: (req, res) => {
    try {
      res.clearCookie("jwt");
      return res.status(200).json({ msg: `${req.user.username} User logout` });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  user: (req, res) => {
    let cookie = req.cookies.jwt;
    return res.status(200).send({ msg: "success", token: cookie });
  },
  // Google Sign in ---------------

  GoogleSignIn: async (req, res) => {
    const token = req.body.token;
    const ticket = await client.verifyIdToken({
      idToken:token,
      expectedAudience:process.env.G_ClientID
    });
    const {name,email,picure}=ticket.payload();
    return res.status(200).json({msg:"Login in",data:{name,email}})
  },
  getAlluser:()=>{
    return res.status(200).json({
      msg:"success",
      data:[
        {id:1,name:"Vakil",course:"CSE"},
        {id:2,name:"Deva",course:"EEE"},
        {id:3,name:"Radha",course:"All"}
      ]
    })
  }

};
