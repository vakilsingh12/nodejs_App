const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const registerSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    contact: {
      type: Number,
      required: true,
    },
    tokens:[{
      token:{
        type:String,
        required:true
      }
    }]
  },
  {
    timestamps: true,
  }
);
// generateToken
registerSchema.methods.generateAuthToken = async function(){
  try{
    const token=jwt.sign({_id:this._id},"HelloWorldhere");
    this.tokens=this.tokens.concat({token:token});
    await this.save()
    return token;
  }catch(error){
  console.log(error);
  res.status(400).send("Something went wrong in token")
  }
}
registerSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
let model = new mongoose.model("register", registerSchema);
module.exports = model;
