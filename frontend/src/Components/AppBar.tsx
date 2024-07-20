import { useEffect, useState } from 'react';
import { Links } from '../data/links';
import { Link, useLocation } from 'react-router-dom';
import { CiMenuBurger } from "react-icons/ci";
import { LiaTimesSolid } from "react-icons/lia";

function AppBar() {
    const location = useLocation();
    const { pathname } = location;
    const [isOpen, setIsOpen] = useState(false);
  
    useEffect(() => {
      const activeLink = document.querySelector(`a[href="${pathname}"]`);
      if (activeLink) {
        activeLink.classList.add('bg-black', 'text-white');
      }
  
      return () => {
        if (activeLink) {
          activeLink.classList.remove('bg-black', 'text-white');
        }
      };
    }, [pathname]);
  
    const toggleMenu = () => {
      setIsOpen(!isOpen);
    };
  return (
    <div className='flex items-center justify-between p-5 '>
      <h3>LOGO</h3>
      <div className='hidden md:flex items-center gap-5'>
        {Links.map((link) => (
          <Link
            to={link.link}
            key={link.id}
            className={`rounded-2xl py-0.5 px-3 ${pathname === link.link ? 'bg-black text-white' : 'bg-slate-100'}`}
          >
            {link.name}
          </Link>
        ))}
      </div>
      <button className=' connect py-0.5 px-3 hidden md:block'>Let's Talk</button>
      <button className='md:hidden py-0.5 px-3 transition ease-in-out ' onClick={toggleMenu}>
        {
          isOpen ?  <LiaTimesSolid/> : <CiMenuBurger/> 
        }
      </button>
      {isOpen && (
        <div className='absolute top-16 left-0 right-0 bg-gray-300 flex flex-col items-center gap-5 p-5 md:hidden rounded-b-2xl'>
          {Links.map((link) => (
            <Link
              to={link.link}
              key={link.id}
              className={`rounded-2xl py-0.5 px-3 ${pathname === link.link ? 'bg-black text-white' : 'bg-slate-100'}`}
              onClick={() => setIsOpen(false)} 
            >
              {link.name}
            </Link>
          ))}
          <button className=' py-0.5 px-3'>sign in</button>
        </div>
      )}
    </div>
  );
}

export default AppBar;