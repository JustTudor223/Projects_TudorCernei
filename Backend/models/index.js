const mongoose = require("mongoose");
const uri = "mongodb+srv://tudorcernei:tudor416@cluster1.btfs3lc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1";


function main() {
    mongoose.connect(uri).then(() => {
        console.log("Succesfull")
    
    }).catch((err) => {
        console.log("Error: ", err)
    })
}

module.exports = { main };