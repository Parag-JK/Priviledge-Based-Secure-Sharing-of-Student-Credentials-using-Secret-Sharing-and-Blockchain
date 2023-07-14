import { useEffect, useState } from "react"
import { ethers } from "ethers"
import './styles/Home.css'
import { Navbar } from "./components/Navbar"
import { Home } from "./components/Home"
import { CentralAuthority } from './components/CentralAuthority'
import { Institute } from './components/Institute'
import { Error } from "./components/Error"
import { Dashboard } from './components/Dashboard'
import {createBrowserRouter,RouterProvider} from 'react-router-dom'


export default function App() {

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });
    }
    connectMyWallet()
  },[])
  
  const [wallet, setWallet] = useState(false)
  const [loading,setLoading] = useState(true)

  async function connectMyWallet() {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    try {
      await provider.send("eth_requestAccounts", [])
      const signer = provider.getSigner()
      console.log("Account:", await signer.getAddress())
      setWallet(true)
      setLoading(false)
    } catch(err) {
      setWallet(false)
      console.log("Error: " ,err)
    }
  }

  setTimeout(() => {
    setLoading(false)
  },5000)

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />
    },
    {
      path: "/admin",
      element: <CentralAuthority wallet = {wallet} loading = {loading} />
    },
    {
      path: '/institute',
      element: <Institute wallet = {wallet} loading = {loading} />
    },
    {
      path: '/error',
      element: <Error />
    },
    {
      path: '/student',
      element: <Dashboard wallet = {wallet} loading = {loading}/>
    },
  ])
  
  return (
    <div className="flex flex-col justify-between h-screen">
      <header>
        <Navbar />
      </header>
      <main>
        <RouterProvider router={router} />
      </main>
    </div>
  );
}
