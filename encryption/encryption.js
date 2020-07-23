const bcrypt = require("bcrypt");

exports.encryptPassword = async (payload) => {
  if (!payload) return null;
  const hashedPassword = await bcrypt.hash(payload, 12);
  return hashedPassword;
};

exports.checkPassword = async (rowPassword, hashedPassword) => {
  return await bcrypt.compare(rowPassword, hashedPassword);
};
