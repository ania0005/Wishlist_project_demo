import "./Style.css";
import gitHub from "./../../img/gitHub.svg";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__wrapper">
        <p className="footer__copyright">
          © 2026 GiftListify. Made with love for good gifts.
        </p>

        <nav className="footer__nav">
          <a href="/privacy-policy" className="footer__link">
            Privacy Policy
          </a>

          <span className="footer__address">
            Linkstraße 2/8 Etage, 10785 Berlin
          </span>

          <a
            href="https://github.com/ania0005/Wishlist_project"
            target="_blank"
            rel="noopener noreferrer"
            className="footer__github"
          >
            <img src={gitHub} alt="GitHub" />
          </a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;