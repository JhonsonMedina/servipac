const mongoose = require("mongoose");

const dbConnection = async () => {
    try{
   await mongoose.connect("mongodb://127.0.0.1:27017/RegistroUsuario")
   console.log("base de datos conectada")

    } catch(error){
console.log(error);
throw new Error("Error a la hora de iniciar la base de datos")

}
};

module.exports = {dbConnection};