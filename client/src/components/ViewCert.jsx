import React, {useState} from 'react'
import { useForm } from '@mantine/form'
import { TextInput } from '@mantine/core'
import { ethers } from 'ethers'
import {GiCheckMark} from "react-icons/gi"
import CertificateGenerator from '../build/CertificateGenerator.json'

export const ViewCert = () => {

    const [certificate,setCertificate] = useState()
    const [emptySearch,setEmptySearch] = useState()
    const certificateCredentials = ['Institute Address:', 'Institute Name:','Student Name','Student Address:','Record Name:', 'Record Info:']

    const getCertificate = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        await provider.send("eth_requestAccounts", [])
        const signer = provider.getSigner()
        const networkId = Object.keys(CertificateGenerator.networks)[0]
        const contractInstance = new ethers.Contract(CertificateGenerator.networks[networkId].address, CertificateGenerator.abi, signer)
        try {
            const tx = await contractInstance.getCertificate(form.values.instituteName,form.values.studentName,form.values.recordName)
            setCertificate(tx)
            setEmptySearch(false)
        } catch(err) {
            setEmptySearch(true)
            console.log('User not registered',err)
        } 
    }

    const form = useForm({
        initialValues: {
          instituteName: '',
          studentName: '',
          recordName: ''
        },
        validate: {
            instituteName: (value) => (value.length < 3 ? 'Invalid credential': null ),
            studentName: (value) => (value.length < 3 ? 'Invalid credential': null),
            recordName: (value) => (value.length < 3 ? 'Invalid credential': null)
          },
        })


    return (
        <div className='flex flex-col items-center min-h-screen px-32 shadow-inner shadow-black bg-slate-100'>
            <h1 className = 'text-4xl mt-5 text-violet-700 w-full text-center'>View Certificate</h1>
            <p className = 'text-sm text-violet-700 mt-2 text-center w-full'>You can view the required credentials here</p>
            <form onSubmit={form.onSubmit(console.log)} className='flex flex-col min-w-[50vw] gap-2 mt-10 p-5 border-violet-700 border-[1px] rounded-lg shadow-lg shadow-slate-500'>
                <p className='mb-5 text-violet-700'>Enter the following details to get the certificate</p>
                <TextInput label="Institute Name:" {...form.getInputProps('instituteName')}/>
                <TextInput label="Student Name:" {...form.getInputProps('studentName')}/>
                <TextInput label="Record Name:" {...form.getInputProps('recordName')}/>
                <button type = "submit" className='p-2 mt-4 text-violet-800 border-2 border-violet-800 ml-auto mr-auto rounded-[5px] font-semibold hover:bg-violet-800 hover:text-white' onClick={getCertificate}>Get Credential</button>
            </form>
            {(certificate&& certificate[6]) && <div className='mt-10 font-semibold font-mono text-slate-600 '>No Records Found...</div>}
            {emptySearch && <div className='mt-10 font-semibold font-mono text-slate-600 '>No Records Found...</div>}
            {certificate && !emptySearch && !certificate[6] &&
                <div className='mt-10 mb-5 w-fit shadow-slate-500 shadow-md text-slate-900 p-5 rounded-md bg-opacity-20 backdrop-blur-md bg-violet-500'>
                {certificate && certificate.slice(0,-1).map((item,index) => 
                <div key= {index}>
                    <span className='font-semibold'>{certificateCredentials[index]}</span>
                    <span className='ml-2'>{item}</span>
                </div> 
                )}
                <>
                    {certificate && !certificate[6] &&  
                    <div className='flex flex-col'>
                        <a href = {certificate[7]} target = '_blank' className=' mr-auto border-2 border-violet-700 px-4 py-2 rounded-2xl text-violet-800 hover:bg-violet-700 hover:text-slate-100 '>Get Record</a>
                        <div className='ml-10 self-end'>{!certificate[6] && <GiCheckMark className='text-white bg-green-500 text-7xl rounded-full p-2 '/>}</div>
                    </div>
                    }
                </>
            </div>
            }
            
        </div>
    )
}
