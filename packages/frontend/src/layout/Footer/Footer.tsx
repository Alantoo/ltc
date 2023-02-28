import styles from './Footer.module.scss';
import logo from 'assets/footerLogo.png';
import fb from 'assets/social/fb.png';
import insta from 'assets/social/insta.png';
import pin from 'assets/social/pin.png';
import tw from 'assets/social/tw.png';
import { Social } from './Social';
import { Link } from 'react-router-dom';
import React from 'react';
export const Footer = () => {
  return (
    <div className={styles.container}>
      <img src={logo} alt="logo" width={149} height={60} />
      <div className={styles.socialsContainer}>
        <Social
          img={fb}
          imgAlt="facebook"
          imgWidth={47}
          imgHeight={47}
          linkTo="https://facebook.com"
        />
        <Social
          img={insta}
          imgAlt="instagram"
          imgWidth={47}
          imgHeight={47}
          linkTo="https://instagram.com"
        />
        <Social
          img={pin}
          imgAlt="pinterest"
          imgWidth={47}
          imgHeight={47}
          linkTo="https://pinterest.com"
        />
        <Social
          img={tw}
          imgAlt="twitter"
          imgWidth={47}
          imgHeight={47}
          linkTo="https://twitter.com"
        />
      </div>
      <div className={styles.titleContainer}>
        <div className={styles.linksContainer}>
          <Link to="/about">About Us</Link>
          <Link to="/faqs">FAQs</Link>
          <Link to="/contacts">Contact Us</Link>
        </div>
        <p>
          &#169; 2022 Globalmoneylist.com. All rights reserved. Privacy Policy |
          Terms of Use
        </p>
        <p>Website by: Best Website Designer</p>
      </div>
    </div>
  );
};
