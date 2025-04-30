import React from "react";
import styles from "./navbar.module.css";
import { LuShoppingCart, LuUser, LuMenu } from "react-icons/lu";
import { Drawer } from "@mui/material";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [openMenu, setOpenMenu] = React.useState(false);

  const toggleDrawer = () => {
    setOpenMenu(!openMenu);
  };

  return (
    <nav className={styles.navbarContainer}>
      {/* Desktop */}
      <div className={styles.navbarItems}>
        <Link to="/">
          <img className={styles.logo} src="/vite.svg" alt="" />
        </Link>
        <div className={styles.navbarLinksContainer}>
          <NavLinks />
          <Link to="/cart">
            <LuShoppingCart className={styles.navbarLink} />
          </Link>
          <Link to="/auth">
            <LuUser className={styles.navbarLink} />
          </Link>
        </div>
      </div>

      {/* Mobile */}
      <div className={styles.mobileNavbarItems}>
        <Link to="/">
          <img className={styles.logo} src="/vite.svg" alt="" />
        </Link>
        <div className={styles.mobileNavbarLinksContainer}>
          <Link to="/cart">
            <LuShoppingCart className={styles.navbarLink} />
          </Link>
          <Link to="/auth">
            <LuMenu className={styles.navbarLink} onClick={toggleDrawer} />
          </Link>
        </div>
      </div>

      <Drawer anchor="right" open={openMenu} onClose={toggleDrawer}>
        <div className={styles.drawer}>
          <NavLinks />
        </div>
      </Drawer>
    </nav>
  );
}

function NavLinks() {
  return (
    <>
      <Link to="/" className={styles.navbarLink}>
        Início
      </Link>
      <Link to="/meals" className={styles.navbarLink}>
        Pratos
      </Link>
      <Link to="/profile" className={styles.navbarLink}>
        Perfil
      </Link>
    </>
  );
}
