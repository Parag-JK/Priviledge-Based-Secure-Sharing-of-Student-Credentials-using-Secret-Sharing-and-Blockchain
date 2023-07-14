import React from 'react'
import { ethers } from 'ethers'
import ErrorImg from '../images/error_image.png'
export const Error = () => {
  async function openMetaMaskPopup() {
    if (window.ethereum) {
        try {
            await ethereum.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] });
        } catch (error) {
            console.error(error);
        }
    } else {
        console.log('Please install MetaMask!');
    }
}
  return (
    <div className='flex items-center h-screen px-32 shadow-inner shadow-black bg-slate-100'>
        <div className='flex flex-col p-2 ml-auto mr-auto bg-white'>
            <h2 className='mt-2 font-mono text-xl font-semibold text-center text-violet-500'>Invalid account</h2>
            <img src = {ErrorImg} alt = 'Error image' fetchpriority = 'high' decoding = 'async' role = 'presentation' loading='lazy'className='max-w-[600px] w-full'/>
            <p className='text-center'>Make sure you are connected with the correct address</p>
            <button className='p-3 px-4 mt-5 mb-2 ml-auto mr-auto text-white bg-blue-500 rounded-2xl' onClick={openMetaMaskPopup}>Connect Account</button>
        </div>
       
    </div>
  )
}
