import React, { useState, useContext } from 'react'; // Removed useEffect, added useContext
import AppContext from '../../context/AppContext'; // Import AppContext

const NavbarComponent = () => {
  const { language, changeLanguage, t, title: appTitle } = useContext(AppContext); // Use context
  const [languageDropdownVisible, setLanguageDropdownVisible] = useState(false);

  // Supported languages - could also come from context or config if more dynamic
  const supportedLanguages = [
    { code: 'EN', name: 'English', langAttribute: 'en-EN', labelKey: 'ENGLISH_LANG' }, // Assuming labelKey for translation
    { code: 'DE', name: 'Deutsch', langAttribute: 'de-DE', labelKey: 'GERMAN_LANG' },
    { code: 'FR', name: 'Français', langAttribute: 'fr-FR', labelKey: 'FRENCH_LANG' },
  ];

  const currentSelectedLanguage = supportedLanguages.find(l => l.code === language) || supportedLanguages[0];

  const toggleLanguageDropdown = () => {
    setLanguageDropdownVisible(!languageDropdownVisible);
  };

  const handleLanguageSelect = (langCode) => {
    changeLanguage(langCode); // Call context function
    setLanguageDropdownVisible(false);
  };

  return (
    <div className="es_app_top" role="banner">
      <div className="container-fluid" id="es_app_header">
        <div id="es_app_header_title" className="">
          <h1 id="header-title-label" className="es_app_title">{appTitle || t('TITLE')}</h1>
        </div>
        <div id="lang-section">
          <button
            id="toggleLanguageBtn"
            type="button"
            className="ecl-button ecl-button--secondary"
            aria-expanded={languageDropdownVisible}
            onClick={toggleLanguageDropdown}
            aria-label={`${t('SELECTLANGUAGELABEL')}, current language ${t(currentSelectedLanguage.labelKey) || currentSelectedLanguage.name}`}
          >
            <i className="fas fa-globe" focusable="false" aria-hidden="true"></i>
            <span id="lang-selection-text" className="btn-text">{t(currentSelectedLanguage.labelKey) || currentSelectedLanguage.name}</span>
          </button>
          {languageDropdownVisible && (
            <div
              className="ecl-site-header__language-container visible"
              id="language-list-overlay"
              data-ecl-language-list-overlay=""
              aria-labelledby="ecl-site-header__language-title"
              role="dialog"
              aria-modal="true"
            >
              <div className="ecl-site-header__language-header">
                <div className="ecl-site-header__language-title" id="ecl-site-header__language-title">
                  {t('SELECTLANGUAGE')}
                </div>
                <button
                  id="languageClsBtn"
                  className="ecl-button ecl-button--ghost ecl-site-header__language-close"
                  type="button"
                  onClick={toggleLanguageDropdown}
                  tabIndex="0"
                  aria-label={t('CLOSE')}
                >
                  <span className="ecl-button__container">
                    <span className="ecl-u-sr-only">{t('CLOSE')}</span>
                    <i className="fas fa-times-circle ecl-icon ecl-button__icon ecl-button__icon--after" focusable="false" aria-hidden="true"></i>
                  </span>
                </button>
              </div>
              <div className="ecl-site-header__language-content ecl-site-header__language-content--stack">
                <div className="ecl-site-header__language-category ecl-site-header__language-category--3-col" data-ecl-language-list-eu="">
                  <div className="ecl-site-header__language-category-title">{t('OFFICIAL')}</div>
                  <ul className="ecl-site-header__language-list">
                    {supportedLanguages.map((lang) => (
                      <li
                        key={lang.code}
                        className={`ecl-site-header__language-item ${language === lang.code ? 'ecl-site-header__language-link--active' : ''}`}
                        id={lang.code}
                        data-lang={lang.code}
                        tabIndex="0"
                        onClick={() => handleLanguageSelect(lang.code)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLanguageSelect(lang.code)}
                      >
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                        <a className="ecl-link ecl-link--standalone ecl-site-header__language-link" lang={lang.langAttribute}>
                          <span className="ecl-site-header__language-link-code">{lang.code.toLowerCase()}</span>
                          <span className="ecl-site-header__language-link-label">{t(lang.labelKey) || lang.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
        <div id="es_app_header_ribbon" style={{}}> {/* Empty style object if no specific styles needed initially */}
          {/* Placeholder for ribbon image, consider if it's needed or how to source it */}
          <img alt="" src="/img/banner-graphical-element.svg" />
        </div>
        {/* Placeholder for Eurostat logo and link */}
        <a id="es_app_title" tabIndex="0" href="https://ec.europa.eu/eurostat/" target="_blank" rel="noopener noreferrer">
          <img
            alt="Home - Eurostat"
            src="/img/estat-logo-horizontal.svg"
            className="d-inline es_logo"
          />
        </a>
      </div>
    </div>
  );
};

export default NavbarComponent;
