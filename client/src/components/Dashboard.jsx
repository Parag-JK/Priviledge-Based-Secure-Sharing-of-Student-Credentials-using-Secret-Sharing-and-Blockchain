import React, { useEffect,useState } from 'react'
import {ethers} from 'ethers'
import CertificateGenerator from '../build/CertificateGenerator.json'
import { Student } from './Student'
import { ViewCert } from './ViewCert'
import { Loader } from '@mantine/core'
import { Error } from './Error'


export const Dashboard = ({loading,wallet}) => {
    const [account,setAccount] = useState('')
    const [isStudent,setIsStudnet] = useState()
    const [certificateDetails,setCertificateDetails] = useState()
    
    const verifyNetwork = async () => {
        if(ethereum.networkVersion === "5777") {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
            setAccount(accounts[0])
            window.ethereum.on('accountsChanged', () => {
              setAccount(accounts[0])
            })
        } else {
            setIsStudnet(false)
        }  
    }


    const getCertificate = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        await provider.send("eth_requestAccounts", [])
        const signer = provider.getSigner()
        const networkId = Object.keys(CertificateGenerator.networks)[0]
        const contractInstance = new ethers.Contract(CertificateGenerator.networks[networkId].address, CertificateGenerator.abi, signer)
        if(account !== '') {
            try {
                const tx = await contractInstance.getCertificatesByStudent(account)
                setCertificateDetails(tx)
            } catch(err) {
                setIsStudnet(false)
                console.log('User not registered',err)
            } 
        } 
    }   


    useEffect(() => {
        verifyNetwork()
    },[])

    useEffect(() => {
        getCertificate()
    },[account])

    useEffect(() => {
        if(certificateDetails) {
            if(certificateDetails[0][0] !== '0x0000000000000000000000000000000000000000') {
                setIsStudnet(true)
            } else {
                setIsStudnet(false)
            }
        } 
    },[account,certificateDetails])


    if(loading) {
        return (
          <div className='flex justify-center items-center h-screen'>
             <Loader size="xl" variant="dots" />
          </div>
        )
      }

      if(!wallet) {
        return (
          <Error />
        )
      }


    return (
        <>
        {isStudent && <Student certificateDetails = {certificateDetails}/>}
        {isStudent === false && <ViewCert />}
        </>
    )
}
