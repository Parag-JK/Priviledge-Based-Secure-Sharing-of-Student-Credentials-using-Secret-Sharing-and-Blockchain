import React, { useEffect, useCallback } from 'react'
import { useForm } from '@mantine/form'
import { TextInput } from '@mantine/core'
import { FileInput } from '@mantine/core'
import { Loader } from '@mantine/core'
import { Modal} from '@mantine/core'
import { Alert } from '@mantine/core'
import {GrCircleAlert} from 'react-icons/gr'
import { useDisclosure } from '@mantine/hooks'
import { useState } from 'react'
import { Error } from './Error'
import { ethers } from 'ethers'
import { create } from 'ipfs-http-client'
import {Buffer} from 'buffer'
import InstituteRegistry from '../build/InstituteRegistry.json'
import CertificateGenerator from '../build/CertificateGenerator.json'

const projectId = '2OdUHAR5IJTS14IH9jVSbz9PvCB'
const projectSecret = 'd91636e86699f3294dd3b4a5c92f8018'
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')

const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  apiPath: '/api/v0',
  headers: {
    authorization: auth,
  }
})


export const Institute = ({wallet,loading}) => {
    let contract
    const [account,setAccount] = useState('')
    const [institutePage, setInstitutePage] = useState()
    const [instituteDetails, setInstitueDetails] = useState({address: '', name: ''})
    const [fileUrl, setFileUrl] = useState(null)
    const [errorPopup,setErrorPopup] = useState(false)
    const [opened, { open, close }] = useDisclosure(false)

    const form = useForm({
      initialValues: { address: '', name: '', certificate: '', description: '', file: null},
      validate: {
        address: (value) => (value.length < 16 ? 'Invalid address' : null),
        name: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
        certificate: (value) => (value.length < 2 ? 'Enter a valid name' : null),
        description: (value) => (value.length < 10 ? 'Too short' : null),
        file: (value) => {
          if (!value) {
            return 'Please select a file'
          }
          if (!value.name.endsWith('.png') && !value.name.endsWith('.jpg')) {
            console.log(value.name)
            return 'Please select an image  file'
          }
          return null
        },
      },
    })


    const verifyInstituteRegistry = async () => {
      if(ethereum.networkVersion === "5777") {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        setAccount(accounts[0])
        window.ethereum.on('accountsChanged', () => {
          setAccount(accounts[0])
        })
        if(account.length !== 0) {
          try {
            const isRegistered = await contract.isRegisteredInstitute(account)
            console.log(isRegistered.toString())
            setInstitutePage(isRegistered)
          } catch (err) {
            console.log(err);
          }
        }
      } else {
        setInstitutePage(false)
      }
    }

    const connectToContract = async () => {
      try {
        const provider = new ethers.providers.JsonRpcProvider('http://localhost:7545')
        const contractABI = InstituteRegistry.abi
        const contractAddress = '0xd508753B983989AE56f05856B91305daD12E8974'
        contract = new ethers.Contract(contractAddress, contractABI, provider)
        await verifyInstituteRegistry()
      } catch(err) {
        console.log("Failed to load connection:", err)
      }
    }

    const getInstituteDetails = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send("eth_requestAccounts", [])
      const signer = provider.getSigner()
      const networkId = Object.keys(InstituteRegistry.networks)[0]
      const contractInstance = new ethers.Contract(InstituteRegistry.networks[networkId].address, InstituteRegistry.abi, signer)
      try {
        const tx = await contractInstance.getInstitute(signer.getAddress())
        setInstitueDetails({address: tx[2], name: tx[0]})
      } catch (err) {
        close()
        console.error("Incorrect netowrk selected: ",err)
      }
    }
    
    const generateCertificate = useCallback(async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send("eth_requestAccounts", [])
      const signer = provider.getSigner()
      const networkId = Object.keys(CertificateGenerator.networks)[0]
      const contractInstance = new ethers.Contract(CertificateGenerator.networks[networkId].address, CertificateGenerator.abi, signer)
      try {
        const tx = await contractInstance.generateCertificate(form.values.address, form.values.name, form.values.certificate, form.values.description,fileUrl)
        await tx.wait()
        setErrorPopup(false)
        console.log('Certificate generated')
        close()
        form.reset()
      } catch (err) {
        setErrorPopup(true)
        close()
        console.log(err)
      }
    },[fileUrl])

    const revokeCredential = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send("eth_requestAccounts", [])
      const signer = provider.getSigner()
      const networkId = Object.keys(CertificateGenerator.networks)[0]
      const contractInstance = new ethers.Contract(CertificateGenerator.networks[networkId].address, CertificateGenerator.abi, signer)
      try {
        const tx = await contractInstance.revokeCertificate(form.values.name, form.values.certificate)
        await tx.wait()
        console.log('Certificate generated')
        form.reset()
        setErrorPopup(false)
      } catch (err) {
        console.error(err)
        setErrorPopup(true)
      }
    }

    async function selectImage(e) {
      const file = e
      try {
        const added = await client.add(file)
        const url = `https://blockcertification.infura-ipfs.io/ipfs/${added.path}`
        setFileUrl(url)
        console.log(fileUrl)
      } catch (error) {
        console.log('Error uploading file: ', error)
      }
    }


    useEffect(() => {
      const fetchData = async () => {
        await connectToContract()
        await getInstituteDetails()
      };
      fetchData();
    },[account])


    const [toggleForm,setToggleForm] = useState(0)
    const buttons = (
      <>
          <button onClick={()=> setToggleForm(0)} className='hover:text-black'>GENERATE CERTIFICATE</button>
          <button onClick={() => setToggleForm(1)} className='hover:text-black'>REVOKE CERTIFICATE</button>
      </>
    )

      const submitForm = () => {
        generateCertificate()
      }

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

      if(institutePage) {
        return (
          <div className='flex flex-col items-center min-h-screen px-32 shadow-inner shadow-black bg-slate-100 '>
            <h1 className = 'text-4xl mt-5 text-violet-700'>Welcome, Institute</h1>
              <p className = 'text-violet-700 mt-2'>You are now eligible to generate or revoke a certificate</p>
              <div className='w-full mt-10 mb-10 bg-white'>
                  <h3 className='m-5 text-2xl'><span className='border-2 border-t-0 border-l-0 border-r-0 border-b-violet-400'>{toggleForm === 0 ? 'Upload ': 'Revoke '}</span>Credentials</h3>
                  {toggleForm === 0 ? <nav className= 'flex justify-between p-2 px-4 mx-6 mt-6 text-white bg-gradient-to-r from-blue-500 via-purple-400 to-slate-300'>
                      {buttons}
                  </nav> : 
                  <nav className= 'flex justify-between p-2 px-4 mx-6 mt-6 text-white bg-gradient-to-r from-slate-300 via-purple-400 to-blue-500'>
                      {buttons}
                  </nav>}
                  {toggleForm === 0 && <form onSubmit={form.onSubmit(open)} className = 'flex flex-col p-6 mt-2'>
                    <Modal opened={opened} onClose={close} title="Verify Details">
                        <hr />
                        <p className='font-semibold mt-4'>Student Address:</p>
                        <p className='text-slate-600'>{form.values.address}</p>
                        <p className='font-semibold'>Student Name:</p>
                        <p className='text-slate-600'>{form.values.name}</p>
                        <p className='font-semibold'>Record Name: </p>
                        <p className='text-slate-600'>{form.values.certificate}</p>
                        <p className='font-semibold'>Record Details: </p>
                        <p className='text-slate-600'>{form.values.description}</p>
                        <button type="submit" mt="sm" className='p-2 mt-6 ml-36 text-white bg-blue-600 rounded-md hover:shadow-md hover:shadow-blue-700' onClick={submitForm}>
                          Add Certificate
                        </button>
                      </Modal>
                      <TextInput label="Institute Address" placeholder="Address" value={instituteDetails.address} disabled/>
                      <TextInput label="Institute Name" placeholder="Name" value={instituteDetails.name} disabled/>
                      <TextInput mt="sm" label="Student Address" placeholder="Student ID"  {...form.getInputProps('address')}/> 
                      <TextInput mt="sm" label="Student Name" placeholder="Student Name"  {...form.getInputProps('name')}/>
                      <TextInput mt="sm" label="Record Name" placeholder="Certificate Type"  {...form.getInputProps('certificate')}/>
                      <TextInput mt="sm" label="Description" placeholder="Record details" {...form.getInputProps('description')} />
                      <FileInput
                        mt="sm"
                        label="Document (Upload in png format)"
                        placeholder="Click here to choose a file"
                        {...form.getInputProps('file')}
                        onChange={(event) => {
                          form.getInputProps('file').onChange(event)
                          selectImage(event)
                        }}
                      />
                      <button type="submit" mt="sm" className='p-2 px-4 mt-6 ml-auto mr-auto border-2 text-violet-500 border-violet-400 rounded-xl hover:bg-violet-100'>
                      Submit
                      </button>
                  </form>}
                  {toggleForm === 1 && <form onSubmit={form.onSubmit(console.log)} className = 'flex flex-col p-6 mt-2'>
                      <TextInput mt="sm" label="Student Name" placeholder="Student Name"  {...form.getInputProps('name')}/>
                      <TextInput mt="sm" label="Record Name" placeholder="Certificate Type"  {...form.getInputProps('certificate')}/>
                      <p className='mt-5 text-sm text-center text-violet-700'>Enter the following details to revoke the particular credential</p>
                      <button type="submit" mt="sm" className='p-2 px-4 mt-6 ml-auto mr-auto border-2 text-violet-500 border-violet-400 rounded-xl hover:bg-violet-100' onClick = {revokeCredential} >
                      Submit
                      </button>
                  </form>}
              </div>
                {errorPopup &&<Alert icon={<GrCircleAlert size="1rem"/>} title="Bummer!" color ="dark" className='my-2 bg-red-300'>
                  Something seems to have went wrong! Check the credentials that you have entered and try again!
                </Alert>}
          </div>
        )
      } else if(institutePage === false){
        return (
          <Error />
        )
      } else {
        <h1 className='text-blue-600 font-bold font-mono h-[90vh] ml-5'>Something went wrong, please check your connection...</h1>
      }
}
