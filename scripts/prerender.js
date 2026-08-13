const puppeteer = require('puppeteer');
const fs = require('fs');
const http = require('http');
const path = require('path');

const requestHandler = (request, response) => {
  let filePath = '.' + request.url;
  if (filePath == './') filePath = './index.html';
  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
    '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpg',
    '.jpeg': 'image/jpeg', '.gif': 'image/gif',
    '.svg': 'image/svg+xml', '.webp': 'image/webp'
  };
  const contentType = mimeTypes[extname] || 'application/octet-stream';
  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(error.code == 'ENOENT' ? 404 : 500);
      response.end();
    } else {
      response.writeHead(200, { 'Content-Type': contentType });
      response.end(content, 'utf-8');
    }
  });
};

const server = http.createServer(requestHandler);

server.listen(0, async () => {
  const port = server.address().port;
  console.log(`Server running at http://localhost:${port}/`);
  
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    
    await page.evaluateOnNewDocument(() => {
      window.gtag = function() {};
    });

    await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));
    
    await page.evaluate(async () => {
      const cc = document.getElementById('cc-main');
      if (cc) cc.remove();
      document.querySelectorAll("noscript").forEach(el => el.remove());

      // Wait for all images to load (max 5s) to ensure naturalWidth is available
      const images = Array.from(document.querySelectorAll("img"));
      const loadPromises = images.map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      });
      await Promise.race([
        Promise.all(loadPromises),
        new Promise(r => setTimeout(r, 5000))
      ]);

      // Optimize images: add lazy loading and explicit dimensions
      images.forEach(img => {
        const rect = img.getBoundingClientRect();
        // Add lazy loading for images below the fold
        if (rect.top > window.innerHeight && !img.hasAttribute("loading")) {
          img.setAttribute("loading", "lazy");
        }
        
        // Add explicit width/height to prevent layout shifts
        if (!img.getAttribute("width") && img.naturalWidth) {
           img.setAttribute("width", img.naturalWidth);
        }
        if (!img.getAttribute("height") && img.naturalHeight) {
           img.setAttribute("height", img.naturalHeight);
        }
      });
    });
    
    let html = await page.content();
    fs.writeFileSync('index.html', html);
    console.log('Successfully pre-rendered index.html');
    
    await browser.close();
    server.close();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});
