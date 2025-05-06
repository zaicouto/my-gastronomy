import React from "react";
import s from "./navbar.module.css";
import { LuShoppingCart, LuUser, LuMenu } from "react-icons/lu";
import { Drawer } from "@mui/material";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [openMenu, setOpenMenu] = React.useState(false);

  const toggleDrawer = () => {
    setOpenMenu(!openMenu);
  };

  return (
    <nav className={s.container}>
      {/* Desktop */}
      <div className={s.items}>
        <Link to="/">
          <img className={s.logo} src="/vite.svg" alt="" />
        </Link>
        <div className={s.linksContainer}>
          <NavLinks />
          <Link to="/cart">
            <LuShoppingCart className={s.navbarLink} />
          </Link>
          <Link to="/auth">
            <LuUser className={s.navbarLink} />
          </Link>
        </div>
      </div>

      {/* Mobile */}
      <div className={s.mobileItems}>
        <Link to="/">
          <img className={s.logo} src="/vite.svg" alt="" />
        </Link>
        <div className={s.mobileLinksContainer}>
          <Link to="/cart">
            <LuShoppingCart className={s.navbarLink} />
          </Link>
          <Link to="/auth">
            <LuMenu className={s.navbarLink} onClick={toggleDrawer} />
          </Link>
        </div>
      </div>

      <Drawer anchor="right" open={openMenu} onClose={toggleDrawer}>
        <div className={s.drawer}>
          <NavLinks />
        </div>
      </Drawer>
    </nav>
  );
}

function NavLinks() {
  return (
    <>
      <Link to="/" className={s.navbarLink}>
        Início
      </Link>
      <Link to="/meals" className={s.navbarLink}>
        Pratos
      </Link>
    </>
  );
}
