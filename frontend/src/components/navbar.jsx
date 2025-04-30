import React from "react";
import styles from "./navbar.module.css";
import { LuShoppingCart, LuUser, LuMenu } from "react-icons/lu";
import { Drawer } from "@mui/material";

export default function Navbar() {
  const [openMenu, setOpenMenu] = React.useState(false);

  const toggleDrawer = () => {
    setOpenMenu(!openMenu);
  };

  return (
    <nav className={styles.navbarContainer}>
      {/* Desktop */}
      <div className={styles.navbarItems}>
        <img className={styles.logo} src="/vite.svg" alt="" />
        <div className={styles.navbarLinksContainer}>
          <Links />
          <LuShoppingCart className={styles.navbarLink} />
          <LuUser className={styles.navbarLink} />
        </div>
      </div>

      {/* Mobile */}
      <div className={styles.mobileNavbarItems}>
        <img className={styles.logo} src="/vite.svg" alt="" />
        <div className={styles.navbarLinksContainer}>
          <LuShoppingCart className={styles.navbarLink} />
          <LuMenu className={styles.navbarLink} onClick={toggleDrawer} />
        </div>
      </div>

      <Drawer anchor="right" open={openMenu} onClose={toggleDrawer}>
        <div className={styles.drawer}>
          <Links />
        </div>
      </Drawer>
    </nav>
  );
}

function Links() {
  return (
    <>
      <a href="#" className={styles.navbarLink}>
        Início
      </a>
      <a href="#" className={styles.navbarLink}>
        Pratos
      </a>
      <a href="#" className={styles.navbarLink}>
        Perfil
      </a>
    </>
  );
}
