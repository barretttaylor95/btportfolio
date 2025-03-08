/**
 * Express server for Barrett Taylor's portfolio website
 */
const express = require('express');
const path = require('path');
const fs = require('fs');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;

// Use compression middleware
app.use(compression());

// MIME type mapping - updated with more specific JavaScript MIME types
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript', // Explicitly support ES modules
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.eot': 'application/vnd.ms-fontobject',
  '.xml': 'application/xml',
  '.txt': 'text/plain'
};

// Manual route for service-worker.js to set proper MIME type and no-cache
app.get('/service-worker.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  return res.sendFile(path.join(__dirname, 'service-worker.js'));
});

// Add specific routes for feature JavaScript files to ensure they load as modules
app.get('/features/*.js', (req, res) => {
  const filePath = path.join(__dirname, req.path);
  res.setHeader('Content-Type', 'application/javascript');

  // Check if file exists
  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  } else {
    console.error(`File not found: ${filePath}`);
    return res.status(404).send('File not found');
  }
});

// Add route for API features
app.get('/api/features', (req, res) => {
  res.json({
    features: [
      'java-terminal',
      'api-demo',
      'db-viewer',
      'git-viewer',
      'build-tools',
      'project-demo',
      'ide-tools',
      'code-challenge'
    ]
  });
});

// Serve static files with proper MIME types
app.use(express.static(path.join(__dirname), {
  setHeaders: (res, filePath) => {
    const ext = path.extname(filePath).toLowerCase();

    if (MIME_TYPES[ext]) {
      res.setHeader('Content-Type', MIME_TYPES[ext]);
    }

    // Special handling for JavaScript files and modules
    if (ext === '.js') {
      // Ensure all JavaScript files have the proper MIME type
      res.setHeader('Content-Type', 'application/javascript');
    }

    // Special handling for module files in the features directory
    if (filePath.includes('/features/') && ext === '.js') {
      res.setHeader('Content-Type', 'application/javascript');
    }

    // Set caching headers for static assets
    if (ext !== '.html' && !filePath.includes('service-worker.js') && !filePath.includes('manifest.json')) {
      // Cache static assets for 1 day
      res.setHeader('Cache-Control', 'public, max-age=86400');
    } else {
      // For HTML and other critical files
      res.setHeader('Cache-Control', 'public, max-age=3600');
    }
  }
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Route to handle message submissions
app.post('/api/send-message', (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ success: false, message: 'Message cannot be empty' });
    }

    // In a real implementation, you would send an email here
    // For now, just log it to the console
    console.log(`Message received: ${message}`);

    // You could save the message to a file as a simple storage solution
    const messageData = {
      message,
      timestamp: new Date().toISOString(),
      ip: req.ip
    };

    // Log message to a file (optional)
    try {
      const messagesFile = path.join(__dirname, 'messages.json');
      let messages = [];

      if (fs.existsSync(messagesFile)) {
        const data = fs.readFileSync(messagesFile);
        messages = JSON.parse(data);
      }

      messages.push(messageData);
      fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2));
    } catch (fileErr) {
      console.warn('Error saving message to file:', fileErr);
    }

    res.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ success: false, message: 'Server error processing message' });
  }
});

// Security headers middleware
app.use((req, res, next) => {
  // Content Security Policy - updated to allow module scripts
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' https://cdnjs.cloudflare.com 'unsafe-inline'; style-src 'self' https://cdnjs.cloudflare.com https://fonts.googleapis.com 'unsafe-inline'; font-src 'self' https://cdnjs.cloudflare.com https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'"
  );

  // Other security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  next();
});

// For any routes not matching a static file, serve the index.html
// This enables client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).send('Something went wrong! Please try again later.');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Press Ctrl+C to stop the server`);
});