const { createServer } = require('http');
const { parse } = require('url');
const { join } = require('path');
const serve = require('serve-handler');

const port = process.env.PORT || 3000; // Railway dynamically assigns the PORT environment variable.

const server = createServer((req, res) => {
  const parsedUrl = parse(req.url, true);
  const options = {
    public: join(__dirname, 'dist'), // Serve the `dist` folder
  };
  serve(req, res, options);
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
