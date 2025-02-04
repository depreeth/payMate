import React, { useState } from 'react'
import { FaUserAlt, FaMoneyBillWave } from 'react-icons/fa'
import { AiOutlineClose } from 'react-icons/ai'
import { AiOutlineMenu } from 'react-icons/ai'
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'


const Navbar = () => {

    const [shownav, setShowNav] = useState(false)
    const [nav, setNav] = useState(false)
    const [logo, setLogo] = useState(false)
    const handleNav = () => {
        setNav(!nav)
        setLogo(!logo)
    }

    const  activeLink = "absolute  border-b-[3px] font-bold border-[#2176AE] px-1  text-[#2176AE] cursor-pointer no-underline  "
    const normalLink = " relative font-bold  text-[#2176AE] cursor-pointer no-underline"
    return (
        <div className='flex flex-col'>
            <div className='flex flex-row w-full justify-between   items-center h-20 px-10 absolute z-10 font-Montserrat '>
                <div className='text-[#2176AE]' >
                    <h1 onClick={handleNav} className={logo ? ' hidden' : 'flex text-3xl font-black  '} ><a href='/' onClick={handleNav} className={logo ? ' hidden' : 'flex text-[#2176AE] text-3xl font-black no-underline  '}>Paymate</a> <div className='p-2 m-auto'><FaMoneyBillWave /></div></h1>
                </div>

                <ul className='hidden md:flex'>
                    <li className='p-7'>
                        <NavLink
                            to="/user"
                            class="active"
                            id="nav-links"
                            // className={({ isActive }) => ( isActive ? activeLink : normalLink)}
                            // style={({ isActive }) => ({
                            //     color: isActive ? 'black' : '#2176AE'
                            // })}
                        >
                            Home
                        </NavLink>
                    </li>
                    <li className='p-7'>
                        <NavLink
                            to="/analysis"
                            id="nav-links"
                            // className={({ isActive }) => ( isActive ? activeLink : normalLink)}
                            // style={({ isActive }) => ({
                            //     color: isActive ? 'black' : '#2176AE'
                            // })}
                        >
                            Analysis
                        </NavLink>
                    </li>
                    <li className='p-7'>
                        <NavLink
                            to="/rooms"
                            id="nav-links"
                            // className={({ isActive }) => ( isActive ? activeLink : normalLink)}
                            // style={({ isActive }) => ({
                            //     color: isActive ? 'black' : '#2176AE'
                            // })}
                        >
                            Rooms
                        </NavLink>
                    </li>
                    <li className='p-7'>
                        <NavLink
                            to="/about"
                            id="nav-links"
                            // className={({ isActive }) => ( isActive ? activeLink : normalLink)}
                            // style={({ isActive }) => ({
                            //     color: isActive ? 'black' : '#2176AE'
                            // })}
                        >
                            About Us
                        </NavLink>
                    </li>
                    {/* <li className='p-7'><NavLink exact to='/analysis' activeClassName="active-link2" className=' font-bold  text-[#2176AE] cursor-pointer no-underline'><h4>Analysis</h4></NavLink></li>
                    <li className='p-7'><NavLink exact to='/rooms' activeClassName="active-link3" className=' font-bold  text-[#2176AE] cursor-pointer no-underline'><h4>Rooms</h4></NavLink></li>
                    <li className='p-7'><NavLink exact to='/about' activeClassName="active-link4" className=' font-bold  text-[#2176AE] cursor-pointer no-underline'><h4>About Us</h4></NavLink></li> */}
                </ul>

                <div className=' hidden md:flex md:pr-3 justify-between items-center  cursor-pointer'>
                    <button className='rounded-full p-3 bg-black text-white'><a href='/signin' className=' text-white'><FaUserAlt /></a></button>
                    <button className='bg-red-600 px-6 py-2 mx-2 rounded cursor-pointer text-white hover:bg-red-700  hover:font-bold'><a href='/signup' className=' text-white no-underline'>Sign Up</a></button>
                </div>

                <div className='hidden md:h-3'><hr /></div>
                <div className='md:hidden z-10 text-red-500' onClick={handleNav}>
                    {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
                </div>
                <div onClick={handleNav} className={nav ? 'absolute left-0 top-0 w-full bg-gray-100/90 px-4 py-6 flex flex-col' : 'absolute left-[-100%]'}>
                    <ul>
                        <li className='text-3xl font-bold'>Paymate</li>
                        <li className='p-4 font-bold text-1xl border-b'><a href='/user'>Home</a></li>
                        <li className='p-4 font-bold text-1xl border-b'><a href='/analysis'>Analysis</a></li>
                        <li className='p-4 font-bold text-1xl border-b'><a href='/rooms'>Rooms</a></li>
                        <li className='p-4 font-bold text-1xl border-b'>About Us</li>
                    </ul>
                    <div className='flex flex-col pb-4'>
                        <button className='p-3 border bg-gradient-to-r from-red-600 to-red-400 text-white rounded-md'>ACCOUNT</button>
                    </div>
                    <div className='flex justify-between my-3'>
                        <FaFacebook className='icon text-2xl cursor-pointer ' />
                        <FaInstagram className='icon text-2xl cursor-pointer ' />
                        <FaTwitter className='icon text-2xl cursor-pointer ' />
                        <FaYoutube className='icon text-2xl cursor-pointer ' />
                    </div>
                </div>

            </div>

            {/* <hr className='mt-16'/> */}
        </div>
    )
}

export default Navbar