import React from 'react';

// Placeholder for i18n
const t = (key) => {
  const texts = {
    CLOSE: "Close",
    COPY_URL: "Copy the URL",
    // Add other modal specific texts if any, e.g., modal title
    SHARE_MODAL_TITLE: "Share Content"
  };
  return texts[key] || key;
};

// Props might include:
// - isOpen (boolean to control visibility)
// - onClose (function to close the modal)
// - shareUrl (the URL to be displayed and copied)
// - title (optional, if the modal header needs dynamic title)
const ShareModalComponent = ({ isOpen, onClose, shareUrl, title }) => {
  if (!isOpen) {
    return null;
  }

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(shareUrl || window.location.href)
      .then(() => console.log("URL copied to clipboard!"))
      .catch(err => console.error("Failed to copy URL: ", err));
  };

  return (
    // data-ecl-auto-init="Modal" and data-ecl-modal-toggle might not be needed if controlling via React state
    // However, ECL's JS might rely on them if not fully overridden.
    // For now, assuming React state controls visibility.
    <dialog
      id="iframeModal" // Keep original ID if any external ECL JS targets it, otherwise can be removed
      className="ecl-modal ecl-modal--l is-open" // Added 'is-open' for testing visibility, controlled by isOpen prop
      open // HTML5 dialog needs 'open' attribute to be shown
      aria-labelledby="share-modal-title"
    >
      <div className="ecl-modal__container ecl-container">
        <div className="ecl-modal__content ecl-col-12 ecl-col-m-10 ecl-col-l-8">
          <header className="ecl-modal__header">
            <div className="ecl-modal__header-content" id="share-modal-title">
              {title || t('SHARE_MODAL_TITLE')}
            </div>
            <button
              className="ecl-button ecl-button--ghost ecl-modal__close"
              type="button"
              onClick={onClose}
              aria-label={t('CLOSE')}
            >
              <span className="ecl-button__container">
                <span className="ecl-u-sr-only" data-ecl-label="true">{t('CLOSE')}</span>
                {/* Using Font Awesome class directly for now, ideally use an SVG component or import */}
                <i className="fas fa-times-circle ecl-icon ecl-icon--s ecl-button__icon ecl-button__icon--after" aria-hidden="true"></i>
              </span>
            </button>
          </header>
          <div className="ecl-modal__body">
            <div className="ecl-modal__body-scroll targetUrl" data-ecl-modal-scroll>
              {/* Content of the modal, e.g., the URL to share or iframe embed code */}
              <p>Shareable URL:</p>
              <input type="text" readOnly value={shareUrl || window.location.href} style={{ width: '100%', padding: '0.5rem' }} />
              {/* Placeholder for other share options like iframe code */}
            </div>
          </div>
          <footer className="ecl-modal__footer">
            <div className="ecl-modal__footer-content">
              <button
                className="ecl-button ecl-button--secondary ecl-modal__button"
                onClick={onClose}
                type="button"
              >
                {t('CLOSE')}
              </button>
              <button
                className="ecl-button ecl-button--primary ecl-modal__button"
                onClick={handleCopyUrl}
                type="button" // Changed from submit as it's not submitting a form
              >
                {t('COPY_URL')}
              </button>
            </div>
          </footer>
        </div>
      </div>
    </dialog>
  );
};

export default ShareModalComponent;
