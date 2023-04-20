import React from "react";
import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
 

import logo from "../../images/logo.png";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
 
const NavBarItem = ({ title, url, classprops }) => (
  <li className={`bg-[#9C2B12] hover:bg-[#df340e] py-2 px-7 mx-4 rounded-full cursor-pointer ${classprops}`}> 
  <NavLink to={url} >
      {title}
    </NavLink>
  </li>
);

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = React.useState(false);

  return (
    <nav className="w-full flex md:justify-between md:pl-16 justify-between items-center p-4">
      <div className="md:flex-[0.5] flex-initial justify-center items-center">
       <NavLink to="/">
        <img src={logo} alt="logo" className="w-32 cursor-pointer" />
       </NavLink>
      </div>
      <ul className=" text-white md:flex hidden list-none flex-row justify-between items-center flex-initial">
        {[ 
           { title: "Verify Address", url: "/verifyAddress" },
          ].map((item, index) => (
          <NavBarItem key={item.title + index} title={item.title} url={item.url} /> 
        ))}
        {/* <li className="bg-[#9C2B12] hover:bg-[#df340e] py-2 px-7 mx-4 rounded-full cursor-pointer">
          Verify Address
        </li> */}
      </ul>
      
      <div className="flex relative">
        {!toggleMenu && (
          <HiMenuAlt4 fontSize={28} className="text-white md:hidden cursor-pointer" onClick={() => setToggleMenu(true)} />
        )}
        {/* {toggleMenu && (
          <AiOutlineClose fontSize={28} className="text-white md:hidden cursor-pointer" onClick={() => setToggleMenu(false)} />
        )} */}
        {toggleMenu && (
          <ul
            className="z-10 fixed -top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none
            flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in"
          >
             
            <li className="text-xl w-full my-2"><AiOutlineClose onClick={() => setToggleMenu(false)} /></li>
            {[ 
           { title: "Verify Address", url: "/verifyAddress" },
          ].map((item, index) => (
          <NavBarItem key={item.title + index} title={item.title} url={item.url} /> 
        ))}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
