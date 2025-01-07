const mongoose = require("mongoose");

const { Schema} = mongoose;

const userSchema = new Schema({

    name: String,
    lastName:String,
    direction:String,
    email: String,
    password:String,
  
    status: {
      type: String,
      enum:["active", "inactive"],
      require: true,
      default: "active"
    },
    rol: {
        type: String,
        Enum: ['admin', 'user'],
        require: true,
        default: 'user',
      },
})
//mongodb://127.0.0.1:27017
//creacion del modelo

const User = mongoose.model("User", userSchema);

module.exports = User;