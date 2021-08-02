import React from "react";
import { useHistory } from "react-router";
import "./../CSS/Navbar.css";
import { Link } from "react-router-dom";
import { CgMenu } from "react-icons/cg";
import { useState } from "react";
import { CgCloseO } from "react-icons/cg";
import { motion } from "framer-motion";

const MobileNav = () => {
  const history = useHistory();
  function logout() {
    localStorage.clear();
    history.push("/login");
  }

  const burgerIcon = (
    <CgMenu className="burger" onClick={() => setOpen(!open)} />
  );

  const closeIcon = (
    <CgCloseO className="burger" onClick={() => setOpen(!open)} />
  );

  const [open, setOpen] = useState(false);

  const animateFrom = { opacity: 0, y: -40 }; //y:-40 it should place  the elemt 40px higher than the original position
  const animateTo = { opacity: 1, y: 0 };

  return (
    <div className="mobileNav">
      <div className="logo">
        <h2>Smart Green World</h2>
      </div>
      <nav>
        {open ? closeIcon : burgerIcon}
        {open && open ? (
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
                transition={{ delay: 0.1 }}
              >
                <Link to="/profile">Profile</Link>
              </motion.li>
              <motion.li
                initial={animateFrom}
                animate={animateTo}
                transition={{ delay: 0.2 }}
              >
                <Link to="/note">Notes</Link>
              </motion.li>
              <motion.li
                initial={animateFrom}
                animate={animateTo}
                transition={{ delay: 0.3 }}
              >
                <Link to="/login" onClick={logout}>
                  Logout
                </Link>
              </motion.li>
            </ul>
          </nav>
        ) : (
          ""
        )}
      </nav>
    </div>
  );
};

export default MobileNav;
