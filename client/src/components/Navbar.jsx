import React from 'react'
import '../styles/globals.css'
import {FaWallet} from 'react-icons/fa'
import {FiLink2} from 'react-icons/fi'
import { Menu } from '@mantine/core'



export const Navbar = () => {
  return (
    <nav className = 'navbar '>
        <div className='title'>
            <FaWallet className='walletIcon'/>
            <h1 className = 'heading'>Blockcert</h1>
        </div>
        <Menu shadow="md" width={200} className = 'nav-box' trigger='click' openDelay={100} closeDelay={400} position = 'left'>
            <Menu.Target >
                <span className='modal-icon'>
                    <FiLink2 className='link-icon'/>
                </span>
            </Menu.Target>
            <Menu.Dropdown className='dropdown'>
                <a href = '/'>
                    <Menu.Item>Home</Menu.Item>
                </a>
                <a href = '/admin'>
                    <Menu.Item>Central Authority Portal</Menu.Item>
                </a>
                <a href = '/institute'>
                    <Menu.Item>Institute Portal</Menu.Item>
                </a>
                <a href = '/student'>
                    <Menu.Item>Student Dashboard</Menu.Item>
                </a>
            </Menu.Dropdown>
        </Menu>
    </nav>
  )
}
