import React, { useContext } from 'react'; // Added useContext
import AppContext from '../../context/AppContext'; // Import AppContext

const FooterComponent = () => {
  const { language, t } = useContext(AppContext); // Use context

  const getLinkUrl = (baseName) => {
    // Accessibility link is language-agnostic in the original code
    if (baseName === 'accessibility') {
      return "https://ec.europa.eu/eurostat/web/main/help/accessibility";
    }
    return `https://ec.europa.eu/info/${baseName}_${language.toLowerCase()}`;
  };

  const footerLinksData = [
    {
      id: "footer-legal",
      baseName: "legal-notice", // Used to construct URL
      i18nKey: "LEGAL",
    },
    {
      id: "footer-privacy",
      baseName: "privacy-policy",
      i18nKey: "PRIVACY",
    },
    {
      id: "footer-cookies",
      baseName: "cookies",
      i18nKey: "COOKIES",
    },
    {
      id: "footer-access",
      baseName: "accessibility", // Special handling in getLinkUrl
      i18nKey: "ACCESS",
    },
  ];

  return (
    <footer className="ecl-site-footer" id="footer">
      <div className="ecl-container ecl-site-footer__container">
        <ul className="ecl-site-footer__list" id="footerCredits">
          {footerLinksData.map(linkInfo => (
            <li key={linkInfo.id} className="ecl-site-footer__list-item">
              <a
                id={linkInfo.id}
                href={getLinkUrl(linkInfo.baseName)}
                className="ecl-link ecl-link--standalone ecl-site-footer__link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t(linkInfo.i18nKey)}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
};

export default FooterComponent;
