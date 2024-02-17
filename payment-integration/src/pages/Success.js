import React from 'react'
import {useSearchParams} from 'react-router-dom'
const Success = () => {

  const [query] = useSearchParams()

  return (
    <div className="text-center min-h-screen flex justify-center items-center text-2xl font-bold">
      Congratulations <br />
      Your payment ID is : {query && query.get("payment_id")}
    </div>
  )
}

export default Success