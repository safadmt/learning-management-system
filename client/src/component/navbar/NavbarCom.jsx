import React, { useEffect,  } from "react";

import { FaSearch } from 'react-icons/fa'
import { FaHeart } from "react-icons/fa";

import { IoNotificationsOutline, IoOptionsOutline } from 'react-icons/io5'
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import './navbar.css'
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../api/slices/usersSlice";
import DropdownMenu from "./DropdownMenu";
import { useGetUserAuthQuery } from "../../api/user";
import { clearFilter, setOpenwishlistComponent, setUrlSearchParams } from "../../api/slices/globalSlice";
import Wishlist from "../wishlist/Wishlist";

import { useSearchCoursesMutation } from "../../api/course";



export function NavbarCom() {

  const [navbarOpen, setNavbarOpen] = React.useState(false);
  const [search_text, setSearch_Text] = React.useState("");
  
  const dispatch = useDispatch();
  const Navigate = useNavigate()


  const { user } = useSelector(state => state.userInfo)
  const {isWishlistComponentOpen} = useSelector(state=> state.globalSlice)

  const [getsearchCourses] = useSearchCoursesMutation();

  const handleLogout = () => {
    dispatch(logout())
  }

  const { error } = useGetUserAuthQuery()

  useEffect(() => {
    if (error) {

      if (error.status === 403) {
        handleLogout();
      }
    }
  }, [error])

  const handleNavigate = () => {
    if (!user) {
      Navigate('/login')
    } else if (user?.role === 'instructor') {
      Navigate(`/instructor/${user._id}`)
    } else {
      Navigate('/teacher')
    }
  }
  const handleSubmit = (e)=> {
    e.preventDefault();
    if(!search_text) return false;
    const handleNavigate = (navigate)=> {
      Navigate(navigate)
    }
    dispatch(clearFilter())
    handleNavigate('/courses')
    // setSearchParams({search: search_text})
    dispatch(setUrlSearchParams({search: search_text}))    

  }
  return (
    <>
      <nav id="" className="text-[#f4f9fd] relative flex flex-wrap items-center justify-between px-2 py-3  border-b-2 bg-[#234391]" >
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <li
              className="text-2xl hover:cursor-pointer font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase"
              href="#pablo" onClick={() => Navigate('/')}
            >
              CodeFreak
            </li>
            <button
              className="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <IoOptionsOutline size={24} />
            </button>
          </div>
          <div
            className={
              "lg:flex flex-grow items-center" +
              (navbarOpen ? " block" : " hidden")
            }
            id="example-navbar-danger"
          >
            <ul>
              <li className="nav-item">
                Category
              </li>
            </ul>
            <div className="flex items-end lg:justify-end lg:ml-auto">
              <div className="flex border-2 border-gray-200 rounded">
                <form onSubmit={handleSubmit} className="flex items-center">
                <input type="text" className="px-4 py-2 w-80 text-black" 
                onChange={(e)=> setSearch_Text(e.target.value)} 
                placeholder="Search..." />
                <button className="text-white border-l px-4" type="submit">
                  <FaSearch  size={24} color="#f4f9fd" />
                </button>
                </form>
              </div>
            </div>

            <ul className="flex flex-col lg:flex-row list-none gap-4 lg:ml-auto">
              
              <li className="nav-item hover:cursor-pointer" onClick={handleNavigate}>
                {user?.role === "instructor" ? "Instructor" : "Teach on CodeFreak"}
              </li>
             { <li className="nav-item">
                <FaHeart color="#ff4d4d" className="hover:cursor-pointer" size={24} 
                onClick={()=> user ? dispatch(setOpenwishlistComponent()) : Navigate('/login')}/>
                {isWishlistComponentOpen && <Wishlist/>}
              </li>}
              <li className="nav-item">
                <IoNotificationsOutline size={24} />
              </li>
              {user ? <li className="nav-item">
                <DropdownMenu />
              </li> : <div className="lg:flex gap-2"><li className="nav-item">
                <Link className="border-2 p-2 lg:my-auto hover:bg-emerald-400 " to={'/login'}>Login</Link>
              </li>
                <li className="nav-item ">
                  <Link className="border-2 p-2 my-auto hover:white" to={'/signup'}>Signup</Link></li>
              </div>}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}


export default NavbarCom;