import React from 'react'
import HomePage from '../images/homepage.png'


export const Home = () => {
  return (
    <div className="h-[90.5vh] bg-gradient-to-r from-orange-300 to-rose-300 grid grid-cols-2 overflow-hidden max-md:grid-cols-1">
        <div className='flex flex-col w-full gap-4 p-8 text-violet-800 font-bold font-mono mt-10 ml-5'>
            <h1 className='text-6xl mt-16'>Blockcert</h1>
            <p className='mt-2 ml-1 text-sm'>A Decentralized Certificate Issuance and Verification System to create certificates that are Immutable, Cryptographically Secured, and have Zero Downtime. All powered by decentralized Ethereum Smart Contracts</p>
            <p className='mt-5 ml-1 text-xl'>What are you looking for</p>
            <div className='flex gap-2 mt-5 ml-1'>
                <a className='p-3 text-white transition ease-in delay-150 rounded-md bg-violet-900 hover:bg-black hover:cursor-pointer' href = '/institute'>ISSUE CERTIFICATES</a>
                <a className='p-3 transition ease-in delay-150 bg-white rounded-md text-violet-600 hover:text-white hover:bg-black hover:cursor-pointer' href = '/student'>VIEW CERTIFICATES</a>
            </div>
        </div>
        <img src= {HomePage} alt = 'Homepage' fetchpriority = 'high' decoding = 'async' role = 'presentation' loading='lazy' className='ml-auto w-[100vh] h-[90vh] mr-2 mt-5 overflow-hidden max-md:hidden'/>
    </div>
  )
}
