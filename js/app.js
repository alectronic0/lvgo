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
          <span class="nav-logo-text">${data.site.shortName}</span>
        </a>
        <button class="nav-toggle" aria-label="Toggle navigation" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
        <nav class="nav-links" aria-label="Main navigation">
          ${data.nav.map(link => `<a href="${link.url}">${link.label}</a>`).join('')}
        </nav>
      </div>
    </header>
  `;

  const renderHero = () => `
    <section class="hero" id="hero">
      <div class="hero-content">
        <img class="hero-logo" src="${data.site.heroLogoPath}" alt="${data.site.name}">
        <h1><span class="accent">L</span>ondon <span class="accent">V</span>ideo <span class="accent">G</span>ame <span class="accent">O</span>rchestra</h1>
        <p class="hero-subtitle">${data.hero.subtitle}</p>
        <div class="hero-actions">
          ${data.hero.actions.map(action => `
            <a class="btn ${action.primary ? 'btn-primary' : 'btn-secondary'}" href="${action.url}" ${action.external ? 'target="_blank" rel="noopener"' : ''}>${action.label}</a>
          `).join('')}
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
          ${data.about.values.map(val => `
            <div class="about-card">
              <h3>${val.icon} ${val.title}</h3>
              <p>${val.text}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;

  const renderConcerts = () => {
    const hasUpcoming = data.concerts.list.some(c => c.status === 'upcoming');
    const past = data.concerts.list.filter(c => c.status === 'past');
    
    return `
      <section id="concerts" class="fade-in">
        <div class="container">
          <div class="eyebrow">🎹 Concerts</div>
          <h2 class="section-title">Our Performances</h2>
          <div class="title-underline"></div>
          <p class="section-subtitle">${data.concerts.subtitle}</p>
          
          <div class="concerts-list">
            ${!hasUpcoming ? `
              <div class="concert-cta">
                <h3>No upcoming concerts at the moment!</h3>
                <p>Join our mailing list to be the first to hear about future performances.</p>
                <a class="btn btn-primary" href="${data.hero.actions.find(a => a.label.includes('Join Mailing List')).url}" target="_blank" rel="noopener">Subscribe for updates</a>
              </div>
            ` : ''}

            ${data.concerts.list.map(c => {
              const isHiddenPast = c.status === 'past' && past.indexOf(c) >= 3;
              const extraStyles = [];
              if (c.status === 'upcoming') extraStyles.push('position:relative;');
              if (isHiddenPast) extraStyles.push('display:none;');
              return `
              <div class="concert-card ${c.status === 'upcoming' ? 'upcoming' : ''} ${c.isLandscape ? 'landscape-card' : ''} ${isHiddenPast ? 'past-hidden' : ''}" style="${extraStyles.join(' ')}">
                ${c.poster 
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
                      ${c.mapUrl ? `<a href="${c.mapUrl}" class="map-link" target="_blank" rel="noopener">(View on map)</a>` : ''}
                    </span>
                  </div>

                  <div class="concert-actions">
                    ${c.infoUrl ? `<a class="btn btn-primary" href="${c.infoUrl}" target="_blank" rel="noopener">🔗 Event Info</a>` : ''}
                    ${c.status === 'upcoming' && c.ticketUrl ? `<a class="btn btn-primary" href="${c.ticketUrl}" target="_blank" rel="noopener">Get Tickets</a>` : ''}
                    ${c.programmeUrl ? `<a class="btn btn-secondary" href="${c.programmeUrl}" target="_blank" rel="noopener">📄 Download Programme</a>` : ''}
                  </div>

                  ${c.soundcloudEmbed ? `<div class="concert-embed">${c.soundcloudEmbed}</div>` : ''}
                </div>
              </div>
            `}).join('')}
          </div>

          ${past.length > 3 ? `
            <div style="text-align: center; margin-top: 48px;">
              <button id="expand-history-btn" class="btn btn-secondary">Show all past concerts</button>
            </div>
          ` : ''}
        </div>
      </section>
    `;
  };

  const getSocialIcon = (name, size = 16) => {
    const social = data.socials.find(s => s.name.toLowerCase().includes(name.toLowerCase()));
    if (social) {
      return `<svg viewBox="${social.viewBox}" style="width: ${size}px; height: ${size}px; fill: currentColor;"><path d="${social.iconPath}"/></svg>`;
    }
    if (name.toLowerCase() === 'spotify') {
      return `<svg viewBox="0 0 496 512" style="width: ${size}px; height: ${size}px; fill: currentColor;"><path d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8zm100.7 364.9c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-39.2-206.7-24.5-3.9 1-9 2.6-11.9 2.6-9.7 0-15.8-7.7-15.8-15.8 0-10.3 6.1-15.2 13.6-16.8 81.9-18.1 165.6-16.5 237 26.2 6.1 3.9 9.7 7.4 9.7 16.5s-7.1 15.4-15.2 15.4zm26.9-65.6c-5.2 0-8.7-2.3-12.3-4.2-72.5-47-175.5-55.6-248.9-35.2-10 2.6-15.9 4.2-20.1 4.2-11.3 0-18.8-9.4-18.8-18.8 0-11.3 6.8-17.4 15.5-19.7 82.2-22.3 195.4-12.9 277 39.4 6.8 4.2 11.3 8.7 11.3 18.1.1 11.9-8.4 16.2-13.7 16.2zm27.2-69.3c-5.5 0-10.7-2.6-14.9-5.2-86.4-55.6-218.4-67.3-305.1-33-10.7 3.9-16.5 5.8-22 5.8-14.6 0-24.9-12.3-24.9-24.9 0-14.6 8.7-21 19.4-24.9 99.3-38.8 247.1-25.2 344.2 37.5 7.1 4.5 12.3 9.7 12.3 19.7.1 14.7-11.1 25-29 25z"/></svg>`;
    }
    return name;
  };

  const renderPersonCard = (person) => `
    <div class="person-card">
      <img src="${person.image}" alt="${person.name}" loading="lazy">
      <div class="person-name">${person.name}</div>
      ${person.role ? `<div class="person-role">${person.role}</div>` : ''}
      ${person.instruments ? `
        <div class="person-instruments">
          ${person.instruments.map(inst => `<span class="instrument-chip">${inst}</span>`).join('')}
        </div>
      ` : ''}
      ${person.links && person.links.length > 0 ? `
        <div class="person-links">
          ${person.links.map(l => `<a href="${l.url}" target="_blank" rel="noopener" aria-label="${l.icon}">${getSocialIcon(l.icon)}</a>`).join('')}
        </div>
      ` : ''}
    </div>
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
            ${data.people.founders.map(renderPersonCard).join('')}
          </div>
        </div>

        <div class="people-section">
          <h3>Committee</h3>
          <div class="people-grid">
            ${data.people.committee.map(renderPersonCard).join('')}
          </div>
        </div>

        <div class="people-section">
          <h3>Conductor</h3>
          <div class="conductor-layout">
            <img src="${data.people.conductor.image}" alt="${data.people.conductor.name} — Conductor" loading="lazy">
            <div class="conductor-bio">
              ${data.people.conductor.bio.map(p => `<p>${p}</p><br>`).join('')}
              ${data.people.conductor.links && data.people.conductor.links.length > 0 ? `
                <div class="person-links" style="margin-top: 16px;">
                  ${data.people.conductor.links.map(l => `<a href="${l.url}" target="_blank" rel="noopener" aria-label="${l.icon}">${getSocialIcon(l.icon)}</a>`).join('')}
                </div>
              ` : ''}
            </div>
          </div>
        </div>

        <div class="people-section">
          <h3>Arrangers & Composers</h3>
          <div class="people-grid">
            ${data.people.arrangers.map(renderPersonCard).join('')}
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
          ${data.socials.filter(s => ['youtube', 'flickr', 'soundcloud'].includes(s.name.toLowerCase())).map(s => `
            <a href="${s.url}" target="_blank" rel="noopener" aria-label="${s.name}" class="platform-link" style="color: var(--text-muted); display: flex; flex-direction: column; align-items: center; gap: 8px; text-decoration: none; transition: color var(--transition);">
              <div style="background: var(--surface); padding: 16px; border-radius: 50%; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; transition: border-color var(--transition);">
                ${getSocialIcon(s.name, 28)}
              </div>
              <span style="font-size: 0.85rem; font-weight: 600;">${s.name}</span>
            </a>
          `).join('')}
        </div>

        <div class="video-grid">
          ${data.media.videos.map(video => `
            <div class="video-embed">
              <iframe src="${video.url}" title="${video.title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>
            </div>
          `).join('')}
        </div>

        <h3 style="font-family: var(--font-heading); font-size: 1.4rem; color: var(--white); margin-bottom: 24px;">Press &amp; Features</h3>
        <div class="media-grid">
          ${data.media.press.map(item => `
            <a class="media-card" href="${item.url}" target="_blank" rel="noopener">
              <h4>${item.title}</h4>
              <div class="media-source">${item.source} — ${item.date}</div>
            </a>
          `).join('')}
        </div>
      </div>
    </section>
  `;

  const renderFriends = () => `
    <section id="friends" class="fade-in">
      <div class="container">
        <div class="eyebrow">🤝 Partners</div>
        <h2 class="section-title">Friends of LVGO</h2>
        <div class="title-underline"></div>
        <p class="section-subtitle">We're proud to collaborate with incredible venues, festivals, and organisations.</p>
        <div class="friends-grid">
          ${data.friends.map(friend => `
            <a class="friend-card" href="${friend.url}" target="_blank" rel="noopener">
              <h4>${friend.icon} ${friend.name}</h4>
              <p>${friend.desc}</p>
              <span class="friend-link">${friend.link} →</span>
            </a>
          `).join('')}
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
          ${data.connect.map(item => `
            <a class="connect-card" href="${item.url}" ${!item.url.startsWith('mailto:') ? 'target="_blank" rel="noopener"' : ''}>
              <div class="connect-icon">${item.icon}</div>
              <h3>${item.title}</h3>
              <p>${item.desc}</p>
              <span class="connect-cta">${item.cta} →</span>
            </a>
          `).join('')}
        </div>
      </div>
    </section>
  `;

  const renderFooter = () => `
    <footer class="site-footer">
      <div class="footer-inner">
        <ul class="footer-socials">
          ${data.socials.map(s => `
            <li>
              <a href="${s.url}" target="_blank" rel="noopener" aria-label="${s.name}">
                <svg viewBox="${s.viewBox}"><path d="${s.iconPath}"/></svg>
              </a>
            </li>
          `).join('')}
        </ul>
        <div class="footer-info">
          <p>${data.site.name} · <a href="mailto:${data.site.email}">${data.site.email}</a></p>
          <p>${data.site.rehearsals}</p>
        </div>
        <div class="footer-charity">
          <p>${data.site.name} is a registered charity in England &amp; Wales · <a href="${data.site.charityUrl}" target="_blank" rel="noopener" style="color: inherit; text-decoration: underline;">Charity No. ${data.site.charityNo}</a></p>
          <p style="margin-top: 8px;">
            <a href="/arrangements.html" style="color: inherit; text-decoration: underline;">Arrangements</a> | 
            <a href="/policies.html" style="color: inherit; text-decoration: underline;">Policies</a>
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
        <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSeQyCmpBdJp3w6dMUzDD8pEgnBQO9gDcQQu0KWzL6jh1155bw/viewform?embedded=true" width="100%" height="100%" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>
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
        <img id="gif" src="" alt="404" loading="lazy">
        <div style="margin-top: 32px;">
          <a class="btn btn-primary" href="/">Return Home</a>
        </div>
      </div>
    </section>
  `;

  const renderLightbox = () => `
    <dialog id="lightbox" class="lightbox">
      <figure class="lightbox-figure">
        <img id="lightbox-img" src="" alt="Expanded Image">
      </figure>
    </dialog>
  `;

  // --- Injection ---
  document.body.insertAdjacentHTML('afterbegin', renderHeader());
  document.body.insertAdjacentHTML('beforeend', renderFooter());
  document.body.insertAdjacentHTML('beforeend', renderLightbox());

  // Lightbox functionality
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');

  if (lightbox && lightboxImg) {
    document.body.addEventListener('click', (e) => {
      if (e.target.matches('.concert-poster, .person-card img, .conductor-layout img, .hero-logo')) {
        lightboxImg.src = e.target.currentSrc || e.target.src;
        lightboxImg.alt = e.target.alt;
        lightbox.showModal();
      }
    });
    lightbox.addEventListener('click', () => {
      lightbox.close();
    });
  }

  document.querySelectorAll('.year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  if (page === 'home') {
    main.innerHTML = renderHero() + renderAbout() + renderConcerts() + renderPeople() + renderMedia() + renderFriends() + renderConnect();

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
      document.querySelectorAll('.nav-links a').forEach(link => {
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
        document.querySelectorAll('.concert-card.past-hidden').forEach(card => {
          card.style.display = '';
          // Trigger fade in for newly visible items if they are in viewport
          observer.observe(card);
        });
        expandBtn.parentElement.style.display = 'none';
      });
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
  } 
  else if (page === 'policies') {
    main.innerHTML = renderPolicies();
  }
  else if (page === 'arrangements') {
    main.innerHTML = renderArrangements();
  }
  else if (page === 'join-us') {
    main.innerHTML = renderJoinUs();
  }
  else if (page === '404') {
    main.innerHTML = renderNotFound();
    
    const notFoundData = data.not_found_data;
    if (notFoundData && notFoundData.length > 0) {
      const random = notFoundData[Math.floor(Math.random() * notFoundData.length)];
      const titleEl = document.getElementById('title');
      const msgEl = document.getElementById('message');
      const gifEl = document.getElementById('gif');
      
      if (titleEl) titleEl.textContent = random.title;
      if (msgEl) msgEl.textContent = random.message;
      if (gifEl) gifEl.src = random.gif;
    }
  }
});
