const mongoose = require("mongoose")
const connectdb = async() => {
    await mongoose.connect("mongodb://127.0.0.1/react_razorpay")
    console.log(`${mongoose.connection.host} is connected`)
}
module.exports = connectdb