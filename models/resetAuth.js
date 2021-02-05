require("dotenv").config();
const mongoose = require("mongoose");
const { v4: uid } = require("uuid");

const { Schema } = mongoose;

const ResetAuthSchema = new Schema({
  email: String,
  uid: String,
});

ResetAuthSchema.methods.setResetRequest = function (email) {
  const _newUid = uid();
  this.email = email;
  this.uid = _newUid;
  return _newUid;
};

ResetAuthSchema.methods.validateResetRequest = function (cUid, sUid) {
  return cUid === sUid;
};

mongoose.model("ResetAuth", ResetAuthSchema);
