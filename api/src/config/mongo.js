
const mongoose = require("mongoose")
const session = require("express-session")
// const MongoDBSession = require("connect-mongodb-session")(session)

const connectMongo = async () => {
    var mongouri = `mongodb+srv://dbAdmin:dbAdmin@cluster0.iduvg.mongodb.net/medicalassitant?retryWrites=true&w=majority`
    const con = await mongoose.connect(
        mongouri,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
        (err) => {
            if (err) console.log(err)
            else console.log(`Connected to DB!!`)
        }
    )
}

module.exports = connectMongo;
