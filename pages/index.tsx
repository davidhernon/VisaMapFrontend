import React from 'react'
import { NextPage } from 'next'
import HomePage from '@src/containers/Home'
import { useRouter } from 'next/dist/client/router'

const Home: NextPage = () => {
  const router = useRouter()
  const { iso } = router.query

  const countryCode = typeof iso === 'string' ? iso.toUpperCase() : undefined

  return <HomePage iso={countryCode} />
}

export default Home
