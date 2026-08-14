document.addEventListener('DOMContentLoaded', () => {
  const data = window.CONTENT;
  if (!data) {
    console.error('Content missing! Make sure content.js is loaded.');
    return;
  }

  const main = document.getElementById('main-content');
  if (!main) return;

  const page = main.getAttribute('data-page');

  // --- Templates ---

  const renderHeader = () => `
    <header class="site-nav">
      <div class="nav-inner">
        <a class="nav-logo" href="#hero">
          <img src="${data.site.logoPath}" alt="${data.site.shortName} Logo" width="44" height="44">
          <span class="nav-logo-text"><span class="color-l">L</span><span class="color-v">V</span><span class="color-g">G</span><span class="color-o">O</span></span>
        </a>
        <button class="nav-toggle" aria-label="Toggle navigation" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
        <nav class="nav-links" aria-label="Main navigation">
          ${data.nav.map((link) => `<a href="${link.url}">${link.label}</a>`).join('')}
        </nav>
      </div>
    </header>
  `;

  const renderHero = () => `
    <section class="hero" id="hero">
      <div class="hero-content">
        <img class="hero-logo" src="${data.site.heroLogoPath}" alt="${data.site.name}" width="120" height="120" fetchpriority="high">
        <h1><span class="color-l">L</span>ondon <span class="color-v">V</span>ideo <span class="color-g">G</span>ame <span class="color-o">O</span>rchestra</h1>
        <p class="hero-subtitle">${data.hero.subtitle}</p>
        <div class="hero-actions">
          ${data.hero.actions
            .map(
              (action) => `
            <a class="btn ${action.primary ? 'btn-primary' : 'btn-secondary'}" href="${action.url}" ${action.external ? 'target="_blank" rel="noopener noreferrer"' : ''}>${action.label}</a>
          `
            )
            .join('')}
        </div>
      </div>
    </section>
  `;

  const renderAbout = () => `
    <section id="about" class="fade-in">
      <div class="container">
        <div class="eyebrow">🎼 About Us</div>
        <h2 class="section-title">Our Mission</h2>
        <div class="title-underline"></div>
        <p class="section-subtitle">${data.about.subtitle}</p>
        <div class="about-grid">
          ${data.about.values
            .map(
              (val) => `
            <div class="about-card">
              <h3>${val.icon} ${val.title}</h3>
              <p>${val.text}</p>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    </section>
  `;

  const renderConcerts = () => {
    const hasUpcoming = data.concerts.list.some((c) => c.status === 'upcoming');
    const past = data.concerts.list.filter((c) => c.status === 'past');

    return `
      <section id="concerts" class="fade-in">
        <div class="container">
          <div class="eyebrow">🎹 Concerts</div>
          <h2 class="section-title">Our Performances</h2>
          <div class="title-underline"></div>
          <p class="section-subtitle">${data.concerts.subtitle}</p>
          
          <div class="concerts-list">
            ${
              !hasUpcoming
                ? `
              <div class="concert-cta">
                <h3>No upcoming concerts at the moment!</h3>
                <p>Join our mailing list to be the first to hear about future performances.</p>
                <a class="btn btn-primary" href="${data.hero.actions.find((a) => a.label.includes('Join Mailing List')).url}" target="_blank" rel="noopener noreferrer">Subscribe for updates</a>
              </div>
            `
                : ''
            }

            ${data.concerts.list
              .map((c) => {
                const isHiddenPast = c.status === 'past' && past.indexOf(c) >= 3;
                const extraStyles = [];
                if (c.status === 'upcoming') extraStyles.push('position:relative;');
                if (isHiddenPast) extraStyles.push('display:none;');
                return `
              <div class="concert-card ${c.status === 'upcoming' ? 'upcoming' : ''} ${c.isLandscape ? 'landscape-card' : ''} ${isHiddenPast ? 'past-hidden' : ''}" style="${extraStyles.join(' ')}">
                ${
                  c.poster
                    ? `<img class="concert-poster" src="${c.poster}" alt="${c.title} concert poster" loading="lazy">`
                    : `<div class="concert-poster-placeholder"><img src="${data.site.logoPath}" alt="LVGO Logo"></div>`
                }
                <div class="concert-info">
                  <span class="concert-badge ${c.status === 'upcoming' ? 'upcoming-badge' : 'past-badge'}">${c.badge}</span>
                  <h3 class="concert-title">${c.title}</h3>
                  <p class="concert-desc">${c.desc}</p>
                  
                  <div class="concert-meta">
                    <span>📅 ${c.status === 'upcoming' ? `<strong>${c.date}</strong>` : c.date}${c.time ? ` &nbsp; 🕖 ${c.status === 'upcoming' ? `<strong>${c.time}</strong>` : c.time}` : ''}</span>
                    <span>📍 ${c.status === 'upcoming' ? `<strong>${c.venue}</strong>` : c.venue} 
                      ${c.mapUrl ? `<a href="${c.mapUrl}" class="map-link" target="_blank" rel="noopener noreferrer">(View on map)</a>` : ''}
                    </span>
                  </div>

                  <div class="concert-actions">
                    ${c.infoUrl ? `<a class="btn btn-primary" href="${c.infoUrl}" target="_blank" rel="noopener noreferrer">🔗 Event Info</a>` : ''}
                    ${c.status === 'upcoming' && c.ticketUrl ? `<a class="btn btn-primary" href="${c.ticketUrl}" target="_blank" rel="noopener noreferrer">Get Tickets</a>` : ''}
                    ${c.programmeUrl ? `<a class="btn btn-secondary" href="${c.programmeUrl}" target="_blank" rel="noopener noreferrer">📄 Download Programme</a>` : ''}
                  </div>

                  ${c.soundcloudEmbed ? `<div class="concert-embed">${c.soundcloudEmbed}</div>` : ''}
                </div>
              </div>
            `;
              })
              .join('')}
          </div>

          ${
            past.length > 3
              ? `
            <div style="text-align: center; margin-top: 48px;">
              <button id="expand-history-btn" class="btn btn-secondary">Show all past concerts</button>
            </div>
          `
              : ''
          }
        </div>
      </section>
    `;
  };

  const SOCIAL_PLATFORMS = [
    { key: 'website', label: 'Website', isGlobe: true },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      viewBox: '0 0 448 512',
      path: 'M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z',
    },
    {
      key: 'x',
      label: 'X',
      viewBox: '0 0 512 512',
      path: 'M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z',
    },
    {
      key: 'bsky',
      label: 'Bluesky',
      viewBox: '0 0 24 24',
      path: 'M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.204-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z',
    },
    {
      key: 'threads',
      label: 'Threads',
      viewBox: '0 0 448 512',
      path: 'M331.5 235.7c2.2 .9 4.2 1.9 6.3 2.8c29.2 14.1 50.6 35.2 61.8 61.4c15.7 36.5 17.2 95.8-30.3 143.2c-36.2 36.1-87.6 52.9-152.9 50c-60.7-2.7-111.4-23.7-146.6-60.8C31.7 392.6 16 340.5 16 283.4c0-62.5 17.6-117.2 51.1-158.1C102 81.9 152.4 56.4 214.3 56c44.8-.3 84.8 11.2 118.8 34.2c32.7 22.1 55.4 53.6 65.5 91.3c2.4 9.1-3 18.5-12.1 20.9c-9.1 2.4-18.5-3-20.9-12.1c-7.9-29.6-25.9-54.3-51.7-71.8c-26.7-18-58.4-27.1-94.2-26.8c-50.6 .3-91.1 20.9-120.4 61.2C71.3 187.9 57 231.7 57 283.4c0 45.4 12.1 86.8 35 119.8c27.6 39.8 68.7 57.5 119.7 59.8c53.3 2.4 94.6-11.2 122.9-40.4c33.5-34.5 32.3-77 22.2-100.5c-6.8-15.9-20.6-29.2-39.9-38.6c-2.3-1.1-4.7-2.1-7.1-3.1c-14.8 45.3-43.1 76-88.7 76.5c-44.5 .5-76.4-28-76.8-70.2c-.4-42.3 31-75.1 76.6-75.6c29.8-.3 56.9 13.5 70.8 34.6zm-113.6 77.2c27.3-.3 47.9-20.6 57.9-52.1c-10.7-14.9-29.2-24.1-50.8-23.9c-27.5 .3-45.9 20.1-45.6 45.8c.3 25.4 18.9 44.2 46.1 44.5z',
    },
    {
      key: 'spotify',
      label: 'Spotify',
      viewBox: '0 0 496 512',
      path: 'M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8zm100.7 364.9c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-39.2-206.7-24.5-3.9 1-9 2.6-11.9 2.6-9.7 0-15.8-7.7-15.8-15.8 0-10.3 6.1-15.2 13.6-16.8 81.9-18.1 165.6-16.5 237 26.2 6.1 3.9 9.7 7.4 9.7 16.5s-7.1 15.4-15.2 15.4zm26.9-65.6c-5.2 0-8.7-2.3-12.3-4.2-72.5-47-175.5-55.6-248.9-35.2-10 2.6-15.9 4.2-20.1 4.2-11.3 0-18.8-9.4-18.8-18.8 0-11.3 6.8-17.4 15.5-19.7 82.2-22.3 195.4-12.9 277 39.4 6.8 4.2 11.3 8.7 11.3 18.1.1 11.9-8.4 16.2-13.7 16.2zm27.2-69.3c-5.5 0-10.7-2.6-14.9-5.2-86.4-55.6-218.4-67.3-305.1-33-10.7 3.9-16.5 5.8-22 5.8-14.6 0-24.9-12.3-24.9-24.9 0-14.6 8.7-21 19.4-24.9 99.3-38.8 247.1-25.2 344.2 37.5 7.1 4.5 12.3 9.7 12.3 19.7.1 14.7-11.1 25-29 25z',
    },
    {
      key: 'soundcloud',
      label: 'SoundCloud',
      viewBox: '0 0 640 512',
      path: 'M111.4 256.3l5.8 65.8-5.8 68.2c-.4 2.6-2.2 4.8-4.8 4.8-2.4 0-4.2-2-4.6-4.6l-5-68.4 5-65.8c.4-2.8 2.2-4.8 4.6-4.8 2.6 0 4.4 2 4.8 4.8zm-37.8 23l4.2 42.8-4.2 43.6c-.2 2.4-1.8 4.2-4.2 4.2-2.2 0-3.8-1.8-4-4l-3.8-43.8 3.8-42.8c.2-2.4 1.8-4.4 4-4.4 2.4 0 4 2 4.2 4.4zm-31.4 13.8l3.4 29-3.4 29.8c-.2 1.8-1.4 3.2-3.2 3.2-1.6 0-2.8-1.4-3-3l-3-29.8 3-29c.2-2 1.4-3.4 3-3.4 1.8 0 3 1.4 3.2 3.2zM464 232c-24.6 0-47 8.4-64.8 22.4-4.4-112.8-97.4-202.4-211.2-202.4-30.6 0-60 6.6-87.2 19.2-7.4 3.4-9.4 7.8-9.6 12v311.2c.2 4.4 3.4 8.2 8 8.6h364.8c61 0 110.4-49.4 110.4-110.4S525 232 464 232z',
    },
    {
      key: 'instagram',
      label: 'Instagram',
      viewBox: '0 0 448 512',
      path: 'M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z',
    },
    {
      key: 'tiktok',
      label: 'TikTok',
      viewBox: '0 0 448 512',
      path: 'M448 209.9a210.1 210.1 0 01-122.8-39.3v178.8A162.6 162.6 0 11185 188.3v89.9a74.6 74.6 0 1052.2 71.2V0h88a121 121 0 00122.8 122.7z',
    },
    {
      key: 'youtube',
      label: 'YouTube',
      viewBox: '0 0 576 512',
      path: 'M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z',
    },
  ];

  const renderSocialSvg = (plat, size = 14) => {
    if (plat.isGlobe) {
      return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`;
    }
    return `<svg viewBox="${plat.viewBox}" width="${size}" height="${size}" fill="currentColor" aria-hidden="true"><path d="${plat.path}"/></svg>`;
  };

  const renderPersonSocialIcons = (person, size = 14) => {
    return SOCIAL_PLATFORMS.map((plat) => {
      const link = (person.links || []).find((l) => {
        const iconKey = (l.icon || '').toLowerCase();
        if (plat.key === 'x') {
          return iconKey === 'x' || iconKey === 'twitter';
        }
        if (plat.key === 'bsky') {
          return iconKey === 'bsky' || iconKey === 'bluesky';
        }
        return iconKey.includes(plat.key);
      });
      if (link) {
        return `<a href="${link.url}" target="_blank" rel="noopener noreferrer" class="person-social-icon active" aria-label="${person.name} on ${plat.label}" title="${plat.label}" onclick="event.stopPropagation()">${renderSocialSvg(plat, size)}</a>`;
      }
      return `<span class="person-social-icon disabled" aria-hidden="true" title="${plat.label}">${renderSocialSvg(plat, size)}</span>`;
    }).join('');
  };

  const getSocialIcon = (name, size = 16) => {
    const social = data.socials.find((s) => s.name.toLowerCase().includes(name.toLowerCase()));
    if (social) {
      return `<svg viewBox="${social.viewBox}" style="width: ${size}px; height: ${size}px; fill: currentColor;"><path d="${social.iconPath}"/></svg>`;
    }
    if (name.toLowerCase() === 'spotify') {
      return `<svg viewBox="0 0 496 512" style="width: ${size}px; height: ${size}px; fill: currentColor;"><path d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8zm100.7 364.9c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-39.2-206.7-24.5-3.9 1-9 2.6-11.9 2.6-9.7 0-15.8-7.7-15.8-15.8 0-10.3 6.1-15.2 13.6-16.8 81.9-18.1 165.6-16.5 237 26.2 6.1 3.9 9.7 7.4 9.7 16.5s-7.1 15.4-15.2 15.4zm26.9-65.6c-5.2 0-8.7-2.3-12.3-4.2-72.5-47-175.5-55.6-248.9-35.2-10 2.6-15.9 4.2-20.1 4.2-11.3 0-18.8-9.4-18.8-18.8 0-11.3 6.8-17.4 15.5-19.7 82.2-22.3 195.4-12.9 277 39.4 6.8 4.2 11.3 8.7 11.3 18.1.1 11.9-8.4 16.2-13.7 16.2zm27.2-69.3c-5.5 0-10.7-2.6-14.9-5.2-86.4-55.6-218.4-67.3-305.1-33-10.7 3.9-16.5 5.8-22 5.8-14.6 0-24.9-12.3-24.9-24.9 0-14.6 8.7-21 19.4-24.9 99.3-38.8 247.1-25.2 344.2 37.5 7.1 4.5 12.3 9.7 12.3 19.7.1 14.7-11.1 25-29 25z"/></svg>`;
    }
    return name;
  };

  const renderPersonCard = (person, index, group = 'arrangers') => `
    <article class="person-card" data-group="${group}" data-index="${index}" tabindex="0" role="button" aria-haspopup="dialog" aria-label="View profile for ${person.name}">
      <div class="person-card-img-wrapper">
        <img src="${person.image}" alt="${person.name}" loading="lazy" width="500" height="500">
      </div>
      <div class="person-card-body">
        <h4 class="person-name">${person.name}</h4>
        ${person.role ? `<div class="person-role">${person.role}</div>` : ''}
      </div>
      <div class="person-social-row">
        ${renderPersonSocialIcons(person, 14)}
      </div>
    </article>
  `;

  const renderPeople = () => `
    <section id="people" class="fade-in">
      <div class="container">
        <div class="eyebrow">🎻 Who We Are</div>
        <h2 class="section-title">Our People</h2>
        <div class="title-underline"></div>

        <div class="people-section">
          <h3>Founders</h3>
          <div class="people-grid">
            ${data.people.founders.map((p, i) => renderPersonCard(p, i, 'founders')).join('')}
          </div>
        </div>

        <div class="people-section">
          <h3>Committee</h3>
          <div class="people-grid">
            ${data.people.committee.map((p, i) => renderPersonCard(p, i, 'committee')).join('')}
          </div>
        </div>

        <div class="people-section">
          <h3>Conductor</h3>
          <div class="conductor-layout">
            <div class="conductor-card-col">
              ${renderPersonCard(data.people.conductor, 0, 'conductor')}
            </div>
            <div class="conductor-bio">
              ${data.people.conductor.bio.map((p) => `<p>${p}</p><br>`).join('')}
            </div>
          </div>
        </div>

        <div class="people-section">
          <h3>Arrangers &amp; Composers</h3>
          <div class="people-grid">
            ${data.people.arrangers.map((p, i) => renderPersonCard(p, i, 'arrangers')).join('')}
          </div>
        </div>
      </div>
    </section>
  `;

  const renderMedia = () => `
    <section id="media" class="fade-in">
      <div class="container">
        <div class="eyebrow">🎬 Media</div>
        <h2 class="section-title">Watch &amp; Listen</h2>
        <div class="title-underline"></div>
        
        <div class="media-platforms" style="display: flex; gap: 24px; margin-bottom: 40px; justify-content: center;">
          ${data.socials
            .filter((s) => ['youtube', 'flickr', 'soundcloud'].includes(s.name.toLowerCase()))
            .map(
              (s) => `
            <a href="${s.url}" target="_blank" rel="noopener noreferrer" aria-label="${s.name}" class="platform-link" style="color: var(--text-muted); display: flex; flex-direction: column; align-items: center; gap: 8px; text-decoration: none; transition: color var(--transition);">
              <div style="background: var(--surface); padding: 16px; border-radius: 50%; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; transition: border-color var(--transition);">
                ${getSocialIcon(s.name, 28)}
              </div>
              <span style="font-size: 0.85rem; font-weight: 600;">${s.name}</span>
            </a>
          `
            )
            .join('')}
        </div>

        <div class="video-grid">
          ${data.media.videos
            .map(
              (video) => `
            <div class="video-embed">
              <iframe src="${video.url}" title="${video.title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>
            </div>
          `
            )
            .join('')}
        </div>

        <h3 style="font-family: var(--font-heading); font-size: 1.4rem; color: var(--white); margin-bottom: 24px;">Press &amp; Features</h3>
        <div class="media-grid">
          ${data.media.press
            .map(
              (item) => `
            <a class="media-card" href="${item.url}" target="_blank" rel="noopener noreferrer">
              <h4>${item.title}</h4>
              <div class="media-source">${item.source} — ${item.date}</div>
            </a>
          `
            )
            .join('')}
        </div>
      </div>
    </section>
  `;

  const renderFriends = () => `
    <section id="friends" class="fade-in">
      <div class="container">
        <div class="eyebrow">🤝 Partners</div>
        <h2 class="section-title">Friends of <span class="brand-lvgo"><span class="color-l">L</span><span class="color-v">V</span><span class="color-g">G</span><span class="color-o">O</span></span></h2>
        <div class="title-underline"></div>
        <p class="section-subtitle">We're proud to collaborate with incredible venues, festivals, and organisations.</p>
        <div class="friends-grid">
          ${data.friends
            .map(
              (friend) => `
            <a class="friend-card" href="${friend.url}" target="_blank" rel="noopener noreferrer">
              <h3>${friend.icon} ${friend.name}</h3>
              <p>${friend.desc}</p>
              <span class="friend-link">${friend.link} →</span>
            </a>
          `
            )
            .join('')}
        </div>
      </div>
    </section>
  `;

  const renderConnect = () => `
    <section id="connect" class="fade-in">
      <div class="container">
        <div class="eyebrow">📬 Get Involved</div>
        <h2 class="section-title">Connect With Us</h2>
        <div class="title-underline"></div>
        <div class="connect-grid">
          ${data.connect
            .map(
              (item) => `
            <a class="connect-card" href="${item.url}" ${!item.url.startsWith('mailto:') ? 'target="_blank" rel="noopener noreferrer"' : ''}>
              <div class="connect-icon">${item.icon}</div>
              <h3>${item.title}</h3>
              <p>${item.desc}</p>
              <span class="connect-cta">${item.cta} →</span>
            </a>
          `
            )
            .join('')}
        </div>
      </div>
    </section>
  `;

  const renderFooter = () => `
    <footer class="site-footer">
      <div class="footer-inner">
        <ul class="footer-socials">
          ${data.socials
            .map(
              (s) => `
            <li>
              <a href="${s.url}" target="_blank" rel="noopener noreferrer" aria-label="${s.name}">
                <svg viewBox="${s.viewBox}"><path d="${s.iconPath}"/></svg>
              </a>
            </li>
          `
            )
            .join('')}
        </ul>
        <div class="footer-info">
          <p>${data.site.name} · <a href="mailto:${data.site.email}">${data.site.email}</a></p>
          <p>${data.site.rehearsals}</p>
        </div>
        <div class="footer-charity">
          <p>${data.site.name} is a registered charity in England &amp; Wales · <a href="${data.site.charityUrl}" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: underline;">Charity No. ${data.site.charityNo}</a></p>
          <p style="margin-top: 8px;">
            <a href="arrangements.html" style="color: inherit; text-decoration: underline;">Arrangements</a> | 
            <a href="policies.html" style="color: inherit; text-decoration: underline;">Policies</a>
          </p>
          <p style="margin-top: 8px;">© <span class="year"></span> ${data.site.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `;

  const renderPolicies = () => `
    <section class="container" style="padding-top: 100px; padding-bottom: 40px; max-width: 800px;">
      <h1 class="section-title">Policies & Legal</h1>
      <div class="title-underline"></div>
      
      <div style="color: var(--text-muted); line-height: 1.8;">
        <h2>Privacy Policy, Cookie Policy & Terms and Conditions</h2>
        <p>For our full Privacy Policy, Cookie Policy, and Terms & Conditions, please contact us directly at <a href="mailto:${data.site.email}" style="color: var(--accent);">${data.site.email}</a>.</p>
        <p>The London Video Game Orchestra is committed to protecting your privacy and ensuring your data is handled securely and transparently in accordance with GDPR guidelines.</p>
      </div>
    </section>
  `;

  const renderArrangements = () => `
    <section class="container" style="padding-top: 100px; padding-bottom: 40px; max-width: 800px;">
      <h1 class="section-title">Submit an Arrangement</h1>
      <div class="title-underline"></div>
      
      <div style="color: var(--text-muted); line-height: 1.8; margin-bottom: 24px;">
        <p>We are always on the lookout for talented arrangers to adapt iconic video game music for our orchestra. If you have an arrangement you'd like us to play, please submit it using the form below.</p>
        
        <h3 style="color: var(--white); margin-top: 24px; margin-bottom: 12px;">Arrangement Policy</h3>
        <ul style="margin-left: 20px; margin-bottom: 24px;">
          <li>Arrangements must be tailored for our specific orchestral instrumentation.</li>
          <li>Submissions will be reviewed by our musical committee.</li>
          <li>We prioritize music from well-known or culturally significant video games, but we're open to hidden gems!</li>
        </ul>
      </div>

      <div style="position: relative; width: 100%; height: 1280px; background: #fff; border-radius: 12px; overflow: hidden;">
        <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSeQyCmpBdJp3w6dMUzDD8pEgnBQO9gDcQQu0KWzL6jh1155bw/viewform?embedded=true" title="Submit an Arrangement Form" width="100%" height="100%" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>
      </div>
    </section>
  `;

  const renderJoinUs = () => `
    <section class="container" style="padding-top: 100px; padding-bottom: 40px; max-width: 800px;">
      <h1 class="section-title">Join Us</h1>
      <div class="title-underline"></div>
      
      <div style="color: var(--text-muted); line-height: 1.8; margin-bottom: 24px;">
        <p>Register an expression of interest to join the LVGO and should a vacancy become available we will be in contact.</p>
        <p>We rehearse every Thursday evening in a central location near Old St / Angel / Barbican. We are an amateur membership orchestra (membership fees apply).</p>
        
        <h3 style="color: var(--white); margin-top: 32px; margin-bottom: 16px;">How to apply</h3>
        <p>Please send us an email covering the following details:</p>
        <ul style="margin-left: 20px; margin-bottom: 32px;">
          <li>Your Full Name</li>
          <li>Phone Number</li>
          <li>What instrument(s) do you play and to what level / grades passed?</li>
          <li>List your recent ensemble experience (year and group)</li>
          <li>Why would you like to join?</li>
          <li>How did you hear about us?</li>
          <li>Feel free to add links to your playing!</li>
        </ul>

        <a class="btn btn-primary" href="mailto:team@lvgo.co.uk?subject=Expression%20of%20Interest%20-%20Joining%20LVGO&body=Hi%20LVGO%20Team%2C%0A%0AHere%20is%20my%20expression%20of%20interest%20to%20join%3A%0A%0AName%3A%20%0APhone%3A%20%0AInstruments%20%26%20Level%3A%20%0ARecent%20Ensemble%20Experience%3A%20%0AWhy%20I'd%20like%20to%20join%3A%20%0AHow%20I%20heard%20about%20LVGO%3A%20%0ALinks%20to%20my%20playing%3A%20%0A%0AThanks!" style="display: inline-block; padding: 16px 32px; font-size: 1.1rem;">
          ✉️ Email Us to Join
        </a>
      </div>
    </section>
  `;

  const renderNotFound = () => `
    <section class="not-found">
      <div>
        <h1>404</h1>
        <h2 id="title">Game Over</h2>
        <p id="message">The page you're looking for has been moved or doesn't exist.</p>
        <div style="margin-top: 32px;">
          <a class="btn btn-primary" href="./index.html">Return Home</a>
        </div>
      </div>
    </section>
  `;

  const renderLightbox = () => `
    <dialog id="lightbox" class="lightbox" aria-label="Image Preview">
      <figure class="lightbox-figure">
        <button class="lightbox-close" aria-label="Close image preview" type="button">&times;</button>
        <img id="lightbox-img" src="" alt="Expanded Image">
      </figure>
    </dialog>
  `;

  const renderPersonModal = () => `
    <dialog id="person-modal" class="person-modal" aria-label="Team Member Profile">
      <div class="person-modal-card">
        <button class="person-modal-close" aria-label="Close profile modal" type="button">&times;</button>
        <div class="person-modal-grid">
          <div class="person-modal-img-col">
            <img id="person-modal-img" src="" alt="" width="500" height="500">
          </div>
          <div class="person-modal-info-col">
            <div class="person-modal-badges" id="person-modal-badges"></div>
            <h3 class="person-modal-name" id="person-modal-name"></h3>
            <div class="person-modal-role" id="person-modal-role"></div>
            <div class="person-modal-bio" id="person-modal-bio"></div>
            <div class="person-modal-socials" id="person-modal-socials"></div>
          </div>
        </div>
      </div>
    </dialog>
  `;

  // --- Injection ---
  if (!document.querySelector('.skip-link')) {
    document.body.insertAdjacentHTML(
      'afterbegin',
      '<a href="#main-content" class="skip-link">Skip to main content</a>'
    );
  }
  if (!document.querySelector('.site-nav')) {
    document.body.insertAdjacentHTML('afterbegin', renderHeader());
  }
  if (!document.querySelector('.site-footer')) {
    document.body.insertAdjacentHTML('beforeend', renderFooter());
  }
  if (!document.querySelector('#lightbox')) {
    document.body.insertAdjacentHTML('beforeend', renderLightbox());
  }
  if (!document.querySelector('#person-modal')) {
    document.body.insertAdjacentHTML('beforeend', renderPersonModal());
  }

  // Lightbox functionality for posters and hero logo
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');

  if (lightbox && lightboxImg) {
    document.body.addEventListener('click', (e) => {
      if (e.target.matches('.concert-poster, .hero-logo')) {
        lightboxImg.src = e.target.currentSrc || e.target.src;
        lightboxImg.alt = e.target.alt || 'Expanded Preview';
        lightbox.showModal();
      }
    });
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.matches('.lightbox-close, .lightbox-close *')) {
        lightbox.close();
      }
    });
  }

  // Person Modal functionality
  const personModal = document.getElementById('person-modal');
  if (personModal) {
    const openPersonModal = (person) => {
      if (!person) return;
      const img = document.getElementById('person-modal-img');
      const name = document.getElementById('person-modal-name');
      const role = document.getElementById('person-modal-role');
      const badges = document.getElementById('person-modal-badges');
      const bio = document.getElementById('person-modal-bio');
      const socials = document.getElementById('person-modal-socials');

      if (img) {
        img.src = person.image;
        img.alt = person.name;
      }
      if (name) name.textContent = person.name;
      if (role) role.textContent = person.role || 'Arranger & Composer';

      if (badges) {
        let badgesHtml = '';
        if (person.role) {
          badgesHtml += `<span class="modal-badge role-badge">${person.role}</span>`;
        } else {
          badgesHtml += `<span class="modal-badge role-badge">Arranger &amp; Composer</span>`;
        }
        if (person.instruments && person.instruments.length > 0) {
          badgesHtml += person.instruments
            .map((inst) => `<span class="modal-badge inst-badge">${inst}</span>`)
            .join('');
        }
        badges.innerHTML = badgesHtml;
      }

      if (bio) {
        if (person.bio) {
          bio.innerHTML = Array.isArray(person.bio)
            ? person.bio.map((p) => `<p>${p}</p>`).join('')
            : `<p>${person.bio}</p>`;
        } else {
          const desc = person.role
            ? `${person.name} serves as ${person.role} for the London Video Game Orchestra, bringing people together through video game music.`
            : `${person.name} is an arranger and composer with the London Video Game Orchestra, crafting symphonic arrangements of iconic video game soundtracks.`;
          bio.innerHTML = `<p>${desc}</p>`;
        }
      }

      if (socials) {
        socials.innerHTML = renderPersonSocialIcons(person, 18);
      }

      personModal.showModal();
    };

    document.body.addEventListener('click', (e) => {
      if (e.target.closest('.person-social-row')) {
        return;
      }
      const card = e.target.closest('.person-card');
      if (card) {
        const group = card.dataset.group;
        const index = parseInt(card.dataset.index, 10);
        let person = null;
        if (group === 'conductor') person = data.people.conductor;
        else if (group === 'founders') person = data.people.founders[index];
        else if (group === 'committee') person = data.people.committee[index];
        else if (group === 'arrangers') person = data.people.arrangers[index];

        if (person) openPersonModal(person);
      }
    });

    document.body.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const card = document.activeElement && document.activeElement.closest('.person-card');
        if (card) {
          e.preventDefault();
          card.click();
        }
      }
    });

    personModal.addEventListener('click', (e) => {
      if (
        e.target === personModal ||
        e.target.matches('.person-modal-close, .person-modal-close *')
      ) {
        personModal.close();
      }
    });
  }

  document.querySelectorAll('.year').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  if (page === 'home') {
    main.innerHTML =
      renderHero() +
      renderAbout() +
      renderConcerts() +
      renderPeople() +
      renderMedia() +
      renderFriends() +
      renderConnect();

    // Mobile nav toggle
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');
    if (toggle && links) {
      toggle.addEventListener('click', () => {
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', !isExpanded);
        toggle.classList.toggle('active');
        links.classList.toggle('active');
      });
      document.querySelectorAll('.nav-links a').forEach((link) => {
        link.addEventListener('click', () => {
          toggle.setAttribute('aria-expanded', 'false');
          toggle.classList.remove('active');
          links.classList.remove('active');
        });
      });
    }

    const expandBtn = document.getElementById('expand-history-btn');
    if (expandBtn) {
      expandBtn.addEventListener('click', () => {
        document.querySelectorAll('.concert-card.past-hidden').forEach((card) => {
          card.style.display = '';
          // Trigger fade in for newly visible items if they are in viewport
          observer.observe(card);
        });
        expandBtn.parentElement.style.display = 'none';
      });
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));
  } else if (page === 'policies') {
    main.innerHTML = renderPolicies();
  } else if (page === 'arrangements') {
    main.innerHTML = renderArrangements();
  } else if (page === 'join-us') {
    main.innerHTML = renderJoinUs();
  } else if (page === '404') {
    main.innerHTML = renderNotFound();

    const notFoundData = data.not_found_data;
    if (notFoundData && notFoundData.length > 0) {
      const random = notFoundData[Math.floor(Math.random() * notFoundData.length)];
      const titleEl = document.getElementById('title');
      const msgEl = document.getElementById('message');

      if (titleEl) titleEl.textContent = random.title;
      if (msgEl) msgEl.textContent = random.message;
    }
  }
});
