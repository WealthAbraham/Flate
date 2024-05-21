const mongoos = require("mongoose");

var uri = "mongodb+srv://WEALTHABRAHAM:Mololuwa2.@primary.tbvdsze.mongodb.net/?retryWrites=true&w=majority&appName=Primary";

exports.dbconnect = async () => await mongoos.connect(uri);

