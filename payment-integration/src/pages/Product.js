import React from 'react'
import Card from '../components/Card'
import ProductData from '../api/product.json'
import axios from 'axios'
const Product = () => {

  const CheckoutHandler = async ({ name, amount }) => {
      const response = await axios.post(
        "http://localhost:5000/payment/checkout",
        { name, amount },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      var options = {
        "key": "rzp_test_QbHG6Z5rNXcwNg",
        "amount": response.data.amount,
        "currency": response.data.currency,
        "name": "Payment Integration",
        "description": "Test Transaction",
        "image": "https://www.freecodecamp.org/news/content/images/2022/04/featured.jpg",
        "order_id": response.data.id,
        "callback_url": "http://localhost:5000/payment/payment-verification",
        "prefill": {
            "name": "Gaurav Kumar",
            "email": "gaurav.kumar@example.com",
            "contact": "9000090000"
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#3399cc"
        }
    };
    var rzp1 = new window.Razorpay(options);
    rzp1.open()
  };
  
  

  return (
    <>
    <section className="text-gray-600 body-font">
  <div className="container px-5 py-24 mx-auto">
    <div className="flex flex-wrap -m-4">
        {
            ProductData.map((c,i) => {
                return <Card key={i} image={c.image} title={c.title} price={c.price} onCheckout={CheckoutHandler}/>
            })
        }
    </div>
  </div>
</section>
    </>
  )
}

export default Product