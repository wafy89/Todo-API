const { Schema, model } = require("mongoose");
const { encryptPassword, checkPassword } = require("../encryption/encryption");
const { sign, verify } = require("../token/tokenValidation");

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "basic"],
    default: "basic",
  },
});

UserSchema.method("checkPassword", async function (loginPassword) {
  return await checkPassword(loginPassword, this.password);
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  else this.password = await encryptPassword(this.password);

  next();
});

UserSchema.pre("findOneAndUpdate", async function (next) {
  if (!this._update.hasOwnProperty("password")) return next();
  else this._update.password = await encryptPassword(this._update.password);

  next();
});

const tokenSecret = "kfsdnklfnslfjesiljfesljfsefjsejfsflsgesfgsf";

UserSchema.method("createToken", async function () {
  return await sign({ _id: this._id, access: "auth" }, tokenSecret);
});

UserSchema.static("findUserFromToken", async function (token) {
  let verifiedToken;
  try {
    verifiedToken = await verify(token, tokenSecret);
  } catch (err) {
    return null;
  }
  const user = await this.findOne({ _id: verifiedToken._id });
  return user;
});

module.exports = model("User", UserSchema);
