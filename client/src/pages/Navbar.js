import React from "react";
import { useHistory } from "react-router";
import "./../CSS/Navbar.css";
import { Link } from "react-router-dom";
import MobileNav from "./MobileNav.js";
import { motion } from "framer-motion";

const Navbar = () => {
  const history = useHistory();
  function logout() {
    localStorage.clear();
    history.push("/login");
  }

  const animateFrom = { opacity: 0, y: -40 }; //y:-40 it should place  the elemt 40px higher than the original position
  const animateTo = { opacity: 1, y: 0 };

  return (
    <>
      <header className="navBar">
        <div className="logo">
          <h2>Smart Green World</h2>
        </div>
        <nav>
          <ul className="nav_links">
            <motion.li
              initial={animateFrom}
              animate={animateTo}
              transition={{ delay: 0.05 }}
            >
              <Link to="/">Home</Link>
            </motion.li>
            <motion.li
              initial={animateFrom}
              animate={animateTo}
              transition={{ delay: 0.05 }}
            >
              <Link to="/profile">Profile</Link>
            </motion.li>
            <motion.li
              initial={animateFrom}
              animate={animateTo}
              transition={{ delay: 0.05 }}
            >
              <Link to="/note">Notes</Link>
            </motion.li>
          </ul>
        </nav>
        <button className="button" onClick={logout}>
          Logout
        </button>
      </header>
      <MobileNav />
    </>
  );
};

export default Navbar;
