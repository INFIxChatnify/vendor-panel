"use client" // include with Next.js 13+

import { HttpTypes } from "@medusajs/types"
import { useEffect, useMemo, useState } from "react"
import { decodeToken } from "react-jwt"
import { fetchQuery, sdk } from "../../lib/client"
import { Link, useNavigate, useSearchParams } from "react-router-dom"

export default function GoogleCallback() {
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const [customer, setCustomer] = useState<HttpTypes.StoreCustomer>()
  // for other than Next.js
  const queryParams = useMemo(() => {
    const searchParams = new URLSearchParams(window.location.search)
    return Object.fromEntries(searchParams.entries())
  }, [])

  const sendCallback = async () => {
    let token = ""
    console.log(queryParams)

    try {
      token = await sdk.auth.callback(
        "seller",
        "my-auth", // replace with your auth strategy name
        // pass all query parameters received from the
        // third party provider
        queryParams
      )
    } catch (error) {
      alert("Authentication Failed")

      throw error
    }

    return token
  }

  const createCustomer = async () => {
    // create customer
    await sdk.store.customer.create({
      email: "example@medusajs.com",
    })
  }

  const refreshToken = async () => {
    // refresh the token
    const result = await sdk.auth.refresh()
  }

  const validateCallback = async () => {
    const token = await sendCallback()

    const shouldCreateCustomer =
      (decodeToken(token) as { actor_id: string }).actor_id === ""
    console.log(decodeToken(token))

    // if (shouldCreateCustomer) {
    //   // setLoading(false)
    //   // navigate("/register", { replace: true })
    //   //   const res = await sdk.admin.user.me().then(({ user }) => {
    //   //     console.log(user)
    //   //   })
    //   //   const res = await fetch("http://localhost:9000/auth/session", {
    //   //     method: "POST",
    //   //     headers: {
    //   //       "Content-Type": "application/json",
    //   //       authorization: `Bearer ${token}`,
    //   //     },
    //   //   })
    //   //   console.log(res)
    //   //   const seller = {
    //   //     name: "Peng Jan Kul",
    //   //     member: {
    //   //       name: "Peng Jan Kul",
    //   //       email: "pengjankul@gmail.com",
    //   //     },
    //   //   }
    //   //   await fetchQuery("/vendor/sellers", {
    //   //     method: "POST",
    //   //     body: seller,
    //   //   })
    // } else {

    // }

    // await fetchQuery("/auth/session", {
    //   method: "GET",
    // })
    // // // all subsequent requests are authenticated
    // const { customer: customerData } = await sdk.store.customer.retrieve()
    // console.log(customerData)

    // setCustomer(customerData)

    navigate("/dashboard", { replace: true })
    setLoading(false)
  }

  useEffect(() => {
    if (!loading) {
      return
    }

    validateCallback()
  }, [loading])

  return (
    <div>
      {loading && <span>Loading...</span>}
      {customer && <span>Created customer {customer.email} with Google.</span>}
    </div>
  )
}
