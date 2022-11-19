const mongoose = require("mongoose");
const { v4: guid } = require("uuid");

const { Schema } = mongoose;

const ResetAuthSchema = new Schema({
  email: String,
  id: String,
});

ResetAuthSchema.methods.setResetRequest = function (email) {
  const id = guid();
  this.email = email;
  this.id = id;
  return id;
};

ResetAuthSchema.methods.validateResetRequest = function (idFromRequest, idFromDatabase) {
  return idFromRequest === idFromDatabase;
};

mongoose.model("ResetAuth", ResetAuthSchema);
