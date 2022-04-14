import footerStyles from '../styles/Footer.module.css';

function Footer() {
  return (
    <div className={footerStyles.footer_container}>
      <p className={footerStyles.footer_text}>consolejobcontact@gmail.com</p>
      <p className={footerStyles.footer_text}>
        © 2022 Lawrence Mueller Software LLC | All Rights Reserved.
      </p>
    </div>
  );
}

export default Footer;
