const mongoose = require("mongoose");
const {Schema} = require('mongoose');

const addressSchema = new mongoose.Schema({
  address1: {
    type: String,
    required: true,
  },

  address2: {
    type: String,
  },

  city: {
    type: String,
  },

  state: {
    type: String,
  },

  country: {
    type: String,
  },
  pincode:{
    type: Number
  },
  user: { // set relation with User table 
    type: Schema.Types.ObjectId,
    ref: 'User', // name should be same as model name that we export in model
    required: true
 },
 nearest_area:[
  {
    type: String
  }
 ],
 working_slots:[
  {
    from : String,
    to: String
  }
  , { _id: false }
 ]

},{timestamps: true});




const Address = mongoose.model("Address", addressSchema);

module.exports = Address;
