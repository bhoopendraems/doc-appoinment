const mongoose = require("mongoose");
// connection code is here 
mongoose
  .connect("mongodb://localhost:27017/appointment", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongo Database Connection Successfully Done");
  })
  .catch((error) => {
    console.log(error.message);
  });

module.exports = mongoose;
