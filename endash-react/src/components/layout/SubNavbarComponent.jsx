import React, { useState, useContext } from 'react'; // Added useContext
import AppContext from '../../context/AppContext'; // Import AppContext

const SubNavbarComponent = () => {
  const { t } = useContext(AppContext); // Use context for translations
  const [infoDropdownOpen, setInfoDropdownOpen] = useState(false);
  const [shareDropdownOpen, setShareDropdownOpen] = useState(false);

  // Dummy click handlers for now
  const handleTutorialClick = () => console.log("Tutorial clicked");
  const handleFeedbackClick = () => console.log("Feedback clicked");
  const handleSocialShare = (platform) => console.log(`Share on ${platform} clicked`);

  // In a real app, you might dispatch an action to open the share modal via context or props
  // const openShareModal = () => document.dispatchEvent(new CustomEvent('openShareModal'));


  return (
    <nav aria-label={t('MENU_TOOLBAR_LABEL') || "Menu toolbar"} id="menuToolbar" className="navbar navbar-expand-sm navbar-light bg-light">
      <div className="container-fluid">
        <ul
          id="chartBtns"
          aria-label={t('OPTIONS_GRAPH_TOOLBOX')}
          className="navbar-nav ms-auto my-2 my-lg-0 navbar-nav-scroll"
          style={{ "--bs-scroll-height": "50vw" }}
        >
          {/* Info Button Dropdown */}
          <li className="nav-item dropdown px-1" id="infoBtnChart" role="menuitem">
            <button
              className="ecl-button ecl-button--primary round-btn"
              type="button"
              aria-label={t('INFO')}
              title={t('INFO')}
              onClick={() => setInfoDropdownOpen(!infoDropdownOpen)}
              aria-haspopup="true"
              aria-expanded={infoDropdownOpen}
              id="infoBtn"
            >
              <i className="fas fa-info"></i>
            </button>
            {infoDropdownOpen && (
              <ul className="dropdown-menu dropdown-menu-end show" role="menu" aria-labelledby="infoBtn">
                <li>
                  <button className="dropdown-item ecl-link ecl-link--standalone" onClick={handleTutorialClick}>
                    {t('TUTORIAL')}
                  </button>
                </li>
                <li>
                  <button className="dropdown-item ecl-link ecl-link--standalone" onClick={handleFeedbackClick}>
                    {t('FEED')}
                  </button>
                </li>
              </ul>
            )}
          </li>

          {/* Share Button Dropdown */}
          <li className="nav-item dropdown px-1" id="social-media-dropdown" role="menuitem">
            <button
              className="ecl-button ecl-button--primary round-btn"
              type="button"
              aria-label={t('SHARE')}
              title={t('SHARE')}
              onClick={() => setShareDropdownOpen(!shareDropdownOpen)}
              // onClick={openShareModal} // This would be for a global modal, dropdown is local
              aria-haspopup="true"
              aria-expanded={shareDropdownOpen}
              id="shareChart1"
            >
              <i className="fas fa-share-alt" aria-hidden="true"></i>
            </button>
            {shareDropdownOpen && (
              <ul className="dropdown-menu dropdown-menu-end show" role="menu" aria-labelledby="shareChart1">
                <li><p id="SHARETITLE" className="ecl-social-media-share__description" style={{ fontWeight: 'normal', padding: '0.5rem 1rem', marginBottom: 0 }}>{t('SHARETITLE')}</p></li>
                <li>
                  <button className="dropdown-item ecl-link ecl-link--standalone" onClick={() => handleSocialShare('Twitter')}>
                    <span className="socialImg ecl-icon ecl-icon--m ecl-link__icon ecl-social-media-share__icon">
                      <img className="ecl-icon ecl-icon--m ecl-link__icon ecl-social-media-share__icon" src="/img/social-media/twiter.svg" alt={t('TWITTER_ICON_ALT') || "Twitter Icon"} width="24" height="24" />
                    </span>
                    <span className="ecl-link__label">{t('TWITTER')}</span>
                  </button>
                </li>
                <li>
                  <button className="dropdown-item ecl-link ecl-link--standalone" onClick={() => handleSocialShare('Facebook')}>
                    <span className="socialImg ecl-icon ecl-icon--m ecl-link__icon ecl-social-media-share__icon">
                      <img className="ecl-icon ecl-icon--m ecl-link__icon ecl-social-media-share__icon" src="/img/social-media/face.svg" alt={t('FACEBOOK_ICON_ALT') || "Facebook Icon"} width="24" height="24" />
                    </span>
                    <span className="ecl-link__label">{t('FACEBOOK')}</span>
                  </button>
                </li>
                <li>
                  <button className="dropdown-item ecl-link ecl-link--standalone" onClick={() => handleSocialShare('LinkedIn')}>
                    <span className="socialImg ecl-icon ecl-icon--m ecl-link__icon ecl-social-media-share__icon">
                      <img className="ecl-icon ecl-icon--m ecl-link__icon ecl-social-media-share__icon" src="/img/social-media/linkdin.svg" alt={t('LINKEDIN_ICON_ALT') || "Linkedin Icon"} width="24" height="24" />
                    </span>
                    <span className="ecl-link__label">{t('LINKEDIN')}</span>
                  </button>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default SubNavbarComponent;
