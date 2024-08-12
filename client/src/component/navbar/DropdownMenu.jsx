import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setCredential } from '../../api/slices/usersSlice';
import { CgProfile } from 'react-icons/cg';

const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const Navigate = useNavigate()
  // const [dashboaredLinks, setDashboaredLinks] = useState([{}])
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.userInfo)

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    dispatch(setCredential())
  }
  return (
    <div className="dropdown " >
      <button onClick={toggleMenu} className="dropdown-toggle">
        <CgProfile size={24} />
      </button>
      {isOpen && (
        <ul className="dropdown-menu bg-white text-[#235391] px-4" onMouseLeave={() => setIsOpen(false)}>
          <li className="leading-8 hover:text-gray-500">
            <Link to={`/dashboared/${user._id}`} onClick={() => setIsOpen(false)}>Dashboared</Link>
          </li>
          <li className="leading-8 hover:text-gray-500" onClick={() => {
            handleLogout();
            setIsOpen(false)
            Navigate('/')
          }}>
            Logout
          </li>
        </ul>
      )}
    </div>
  );
};

export default DropdownMenu;