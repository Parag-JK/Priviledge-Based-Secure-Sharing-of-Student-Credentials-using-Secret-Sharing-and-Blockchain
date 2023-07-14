import React, { useState,useMemo } from 'react'
import {GiCheckMark} from "react-icons/gi"
import {HiX} from "react-icons/hi"
import { TextInput } from '@mantine/core'
import { BsSearch } from "react-icons/bs"


export const Student = ({certificateDetails}) => {
  
  const [searchValue,setSearchValue] = useState('')
  const [filteredCertificates, setFilteredCertificates] = useState([])
  const certificateCredentials = ['Institute Address:', 'Institute Name:','Student Name','Student Address:','Record Name:', 'Record Info:']


  const filteredCredentials = useMemo(() => {
    if(certificateDetails) {
      const revoked = []
      const notRevoked = []
      certificateDetails.forEach((certificate) => {
        if(certificate[0] !== '0x0000000000000000000000000000000000000000') {
          if (certificate[6] === true) {
            revoked.push(certificate)
          } else {
            notRevoked.push(certificate)
          }
        }
      });
      return [...notRevoked, ...revoked]
    }
  },[certificateDetails])

  const searhcedCredential = (e) => {
    setSearchValue(e.target.value)
    if(filteredCredentials) {
      const filteredCertificates = certificateDetails.filter((certificate) => {
        const recordName = certificate[4]
        const recordLowerCase = recordName.toLowerCase()
        return recordLowerCase.includes(searchValue.toLowerCase())
      })
      setFilteredCertificates(filteredCertificates)
    }
  }


  
  return (
    <div className='flex flex-col min-h-screen shadow-inner shadow-black bg-slate-100 py-4'>
      <h1 className = 'text-4xl mt-2 text-violet-700 w-full text-center'>Student Dashboard</h1>
      <p className = 'text-sm text-violet-700 mt-2 text-center w-full'>View all your required credentials here</p>
      <TextInput placeholder = "Enter record name" icon = {<BsSearch className='text-slate-600'/>} className='w-[25vw] ml-16 mr-auto mt-5' value={searchValue} onChange={(e) => searhcedCredential(e)}/>
      <div className='flex flex-wrap ml-16 gap-4 mt-10 w-full'>
        {searchValue !== '' && filteredCertificates && filteredCertificates.map((certificate,i) => 
        <div key = {i} className='flex w-fit shadow-slate-500 shadow-md text-slate-900 p-5 rounded-md bg-opacity-20 backdrop-blur-md bg-violet-500'>
          <div>
          {certificate.slice(0,-1).map((detail,index) => 
            <div key= {index}>
              <span className='font-semibold'>{certificateCredentials[index]}</span>
              <span className='ml-2'>{detail}</span>
            </div>     
          )}
          <>
          {!certificate[6] &&  <a href = {certificate[7]} target = '_blank' className='border-2 border-violet-800 px-4 py-2 rounded-2xl text-violet-800 hover:bg-violet-800 hover:text-slate-100 hover:opacity-70'>Get Record</a>}
          </>
          </div>
        <div className='ml-10 self-center'>{!certificate[6] && <GiCheckMark className='text-white bg-green-500 text-7xl rounded-full p-2 translate-x-9'/>}</div>
        <div className='ml-10 self-center'>{certificate[6] && <HiX className='text-white bg-red-500 text-7xl rounded-full p-2 '/>}</div>
        </div>
        )}
        {searchValue == '' && filteredCredentials && filteredCredentials.map((certificate,i) => 
          <div key = {i} className='flex w-fit shadow-slate-500 shadow-md text-slate-900 p-5 rounded-md bg-opacity-20 backdrop-blur-md bg-violet-500'>
            <div>
            {certificate.slice(0,-1).map((detail,index) => 
              <div key= {index}>
                <span className='font-semibold'>{certificateCredentials[index]}</span>
                <span className='ml-2'>{detail}</span>
              </div>     
            )}
            <>
            {!certificate[6] &&  <a href = {certificate[7]} target = '_blank' className='border-2 border-violet-800 px-4 py-2 rounded-2xl text-violet-800 hover:bg-violet-300 hover:text-violet-900 '>Get Record</a>}
            </>
            </div>
            <div className='ml-10 self-center'>{!certificate[6] && <GiCheckMark className='text-white bg-green-500 text-7xl rounded-full p-2 translate-x-9'/>}</div>
            <div className='ml-10 self-center'>{certificate[6] && <HiX className='text-white bg-red-500 text-7xl rounded-full p-2 '/>}</div>
          </div>
        )}
      </div>
    </div>
  )
}
