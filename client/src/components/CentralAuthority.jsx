import React, { useEffect, useState, useMemo} from 'react'
import { useForm } from '@mantine/form'
import { Alert, TextInput } from '@mantine/core'
import { Loader } from '@mantine/core'
import { Modal} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import {GrCircleAlert} from 'react-icons/gr'
import { Error } from './Error'
import emailjs from '@emailjs/browser'
import { ethers } from "ethers"
import InstituteRegistry from '../build/InstituteRegistry.json'



export const CentralAuthority = ({wallet ,loading}) => {

    const [contractInstance,setContractInstance] = useState(null)
    const [errorPopup,setErrorPopup] = useState(false)
    const [opened, { open, close }] = useDisclosure(false)

    useEffect(() => {
      connectToWallet()
    },[])
     
    const captcha = useMemo(function generateRandomString() {
      let result = '';
      let characters = 'ABCDEFGHIJKLMOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      for (let i = 0; i < 5; i++) {
          result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return result;
    },[])

    const form = useForm({
      initialValues: { name: '', email: '', address: '', link: '', acronym: '',code: '' },
      validate: {
        address: (value) => (value.length < 16 ? 'Invalid address' : null),
        name: (value) => (value.length < 5 ? 'Name must have at least 5 letters' : null),
        email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        link: (value) => (/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/.test(value) ? null : 'Invalid link'),
        acronym: (value) => (value.length < 2 ? 'Not valid' : null),
        code: (value) =>(value === captcha? 'Invalid code': null) 
      },
    })

    const connectToWallet = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send("eth_requestAccounts", [])
      const signer = provider.getSigner()
      const networkId = Object.keys(InstituteRegistry.networks)[0]
      const instance = new ethers.Contract(InstituteRegistry.networks[networkId].address, InstituteRegistry.abi, signer)
      setContractInstance(instance)
    }

    const registerInstitute = async () => {
      try {
        const tx = await contractInstance.registerInstitute(form.values.name, form.values.email, form.values.address, form.values.link, form.values.acronym)
        await tx.wait()
        setErrorPopup(false)
        window.location.href = '/institute'
      } catch(err) {
        close()
        setErrorPopup(true)
        console.log("Error calling function:", err)
      }
    }

    const submitForm = () => {
      if(form.values.code === captcha) {
        registerInstitute()
      } else {
        alert("Incorrect Code")
        return
      }
    }

    const sendEmail = (e) => {
      e.preventDefault()
      const isFormValid = form.validate()
      if(isFormValid.hasErrors) {
        return 
      }
      open()
      emailjs.sendForm('service_ubl51s1', 'template_2pv95yq', e.target, 'ML4cS7i4DDV1suAu0')
      .then((result) => {
          console.log(result.text);
      }, (error) => {
          console.log(error.text);
      })
    }

    if(loading) {
      return (
        <div className='flex justify-center items-center h-screen' >
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
        <div className='flex flex-col items-center px-32 shadow-inner shadow-black bg-slate-100'>
            <h1 className = 'text-4xl mt-5 text-violet-700'>Welcome,Central Authority</h1>
            <p className = 'text-violet-700 mt-2'>Register your institute through this portal</p>
            <form onSubmit={(e) => form.onSubmit(sendEmail(e))} className = 'flex flex-col w-full p-6 mt-10 min-h-[500px]'>
              <Modal opened={opened} onClose={close} title="Verify Details">
                <hr />
                <p className='font-semibold mt-4'>Institute Address:</p>
                <p className='text-slate-600'>{form.values.address}</p>
                <p className='font-semibold'>Institute Name:</p>
                <p className='text-slate-600'>{form.values.name}</p>
                <p className='font-semibold'>Institute Email: </p>
                <p className='text-slate-600'>{form.values.email}</p>
                <p className='font-semibold'>Institute Link: </p>
                <p className='text-slate-600 mb-4'>{form.values.link}</p>
                <hr className='mb-4'/>
                <TextInput label="Enter Verification Code: " placeholder="enter the code" {...form.getInputProps('code')}/>
                <button mt="sm" className='p-2 mt-6 ml-40 text-white bg-blue-600 rounded-md hover:shadow-md hover:shadow-blue-700' onClick = {submitForm}>
                  Register
                </button>
              </Modal>
                <TextInput label="Institute Address" placeholder="Address" {...form.getInputProps('address')} />
                <TextInput label="Institute Name" placeholder="Name" {...form.getInputProps('name')} />
                <TextInput mt="sm" label="Institute Email" placeholder="Email" {...form.getInputProps('email')} /> 
                <TextInput mt="sm" label="Institute Acronym" placeholder="Shorthand"  {...form.getInputProps('acronym')}/>
                <TextInput mt="sm" label="Institute Link" placeholder="Link" {...form.getInputProps('link')} />
                <input type="hidden" name="message" value = {captcha}/>
                <button mt="sm" className='p-2 mt-6 ml-auto mr-auto text-white bg-blue-600 rounded-md hover:shadow-md hover:shadow-blue-700'>
                Register
                </button>
          </form>
          {errorPopup &&
                <Alert icon={<GrCircleAlert size="1rem"/>} title="Bummer!" color ="dark" className='my-2 bg-red-300'>
                  Something seems to have went wrong! Check the credentials that you have entered and try again!
                </Alert>
          }
        </div>
      )
}
