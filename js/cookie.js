// Inject the Vanilla CookieConsent library script
const ccScript = document.createElement('script');
ccScript.src = 'https://cdn.jsdelivr.net/gh/orestbida/cookieconsent@v3.0.0/dist/cookieconsent.umd.js';
ccScript.onload = () => {
  // Inject the CSS
  const ccStyle = document.createElement('link');
  ccStyle.rel = 'stylesheet';
  ccStyle.href = 'https://cdn.jsdelivr.net/gh/orestbida/cookieconsent@v3.0.0/dist/cookieconsent.css';
  document.head.appendChild(ccStyle);

  // Initialize CookieConsent
  CookieConsent.run({
    guiOptions: {
      consentModal: {
        layout: "cloud",
        position: "bottom center",
        equalWeightButtons: true,
        flipButtons: false
      },
      preferencesModal: {
        layout: "box",
        position: "right",
        equalWeightButtons: true,
        flipButtons: false
      }
    },
    categories: {
      necessary: {
        readOnly: true
      },
      analytics: {},
      marketing: {}
    },
    language: {
      default: "en",
      autoDetect: "browser",
      translations: {
        en: {
          consentModal: {
            title: "Hello there, it's cookie time!",
            description: "We use cookies to enhance your experience, analyze site traffic, and serve tailored content. You can manage your preferences below. See our <a href='/policies/'>Privacy & Cookie Policy</a>.",
            acceptAllBtn: "Accept all",
            acceptNecessaryBtn: "Reject all",
            showPreferencesBtn: "Manage preferences"
          },
          preferencesModal: {
            title: "Cookie Preferences",
            acceptAllBtn: "Accept all",
            acceptNecessaryBtn: "Reject all",
            savePreferencesBtn: "Save preferences",
            closeIconLabel: "Close modal",
            serviceCounterLabel: "Service|Services",
            sections: [
              {
                title: "Cookie Usage",
                description: "We use cookies to ensure the basic functionalities of the website and to enhance your online experience. You can choose for each category to opt-in/out whenever you want."
              },
              {
                title: "Strictly Necessary Cookies <span class=\"pm__badge\">Always Enabled</span>",
                description: "Essential cookies required for the website to function properly.",
                linkedCategory: "necessary"
              },
              {
                title: "Analytics Cookies",
                description: "Used to understand how visitors interact with the website, track metrics, and improve performance (e.g., Google Analytics).",
                linkedCategory: "analytics"
              },
              {
                title: "Marketing Cookies",
                description: "Used to track visitors across websites to display relevant advertisements (e.g., Google Ads).",
                linkedCategory: "marketing"
              }
            ]
          }
        }
      }
    },
    onFirstConsent: ({ cookie }) => {
      updateGtagConsent(cookie.categories);
    },
    onConsent: ({ cookie }) => {
      updateGtagConsent(cookie.categories);
    },
    onChange: ({ changedCategories, cookie }) => {
      updateGtagConsent(cookie.categories);
      
      // Clear GA cookies if analytics revoked
      if (changedCategories.includes('analytics') && !cookie.categories.includes('analytics')) {
        document.cookie = "_ga=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "_gid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        const domainSegments = location.hostname.split('.');
        if (domainSegments.length > 2) {
          const rootDomain = domainSegments.slice(-2).join('.');
          document.cookie = "_ga=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=." + rootDomain + ";";
        }
      }
    }
  });

  // Inject floating cookie settings button
  const cookieBtn = document.createElement('button');
  cookieBtn.className = 'cookie-floating-btn';
  cookieBtn.innerHTML = '🍪';
  cookieBtn.setAttribute('aria-label', 'Cookie Preferences');
  cookieBtn.onclick = () => CookieConsent.showPreferences();
  document.body.appendChild(cookieBtn);
};

document.head.appendChild(ccScript);

function updateGtagConsent(categories) {
  if (typeof gtag !== 'function') return;
  
  gtag('consent', 'update', {
    'analytics_storage': categories.includes('analytics') ? 'granted' : 'denied',
    'ad_storage': categories.includes('marketing') ? 'granted' : 'denied',
    'ad_user_data': categories.includes('marketing') ? 'granted' : 'denied',
    'ad_personalization': categories.includes('marketing') ? 'granted' : 'denied',
    'personalization_storage': categories.includes('analytics') ? 'granted' : 'denied',
    'functionality_storage': categories.includes('necessary') ? 'granted' : 'denied',
    'security_storage': 'granted'
  });
}
