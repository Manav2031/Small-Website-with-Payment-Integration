const express = require("express")
const app = express()
const cors = require("cors")
const morgan = require("morgan")
const crypto = require("crypto")
const dotenv = require("dotenv")
const connectdb = require("./db.config")
const Razorpay = require("razorpay")
const {OrderModel} = require("./order.models")

//config dot env file
dotenv.config()


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });


//connection
connectdb()

//middlewares
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({extended:false}))


//routes

app.post("/payment/checkout", async(req, res) => {
    const {name, amount} = req.body

    const order = await razorpay.orders.create({
        amount: Number(amount*100),
        currency: "INR"
    })

    await OrderModel.create({
        order_id:order.id,
        name:name,
        amount:amount
    })

    console.log({order})
    res.json(order)
})

app.post("/payment/payment-verification", async(req, res) => {
    const {razorpay_payment_id, razorpay_order_id, razorpay_signature} = req.body

    const body_data = razorpay_order_id+"|"+razorpay_payment_id

    const expect = crypto.createHmac('sha256','RMhd4TzsGgoVVgiMX2jDaWjO').update(body_data).digest("hex")

    const isValid = expect === razorpay_signature

    if(isValid)
    {
        await OrderModel.findOneAndUpdate({order_id:razorpay_order_id}, {
            $set: {
                razorpay_payment_id, razorpay_order_id, razorpay_signature
            }
        })
        res.redirect(`http://localhost:3000/success?payment_id=${razorpay_payment_id}`)
        return
    }
    else
    {
        res.redirect("http://localhost:3000/failed")
        return
    }
})

app.listen(5000, () => {
    console.log(`App is listening at http://localhost:5000`)
})