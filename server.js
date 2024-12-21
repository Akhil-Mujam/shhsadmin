import { createServer } from 'http';
import { parse } from 'url';
import { join } from 'path';
import { existsSync, readFileSync } from 'fs';
import serve from 'serve-handler';

const port = process.env.PORT || 3000;

const server = createServer((req, res) => {
  const parsedUrl = parse(req.url, true);
  const publicPath = join(process.cwd(), 'dist');
  const filePath = join(publicPath, parsedUrl.pathname);

  if (existsSync(filePath) && parsedUrl.pathname !== '/') {
    // Serve the static file if it exists
    serve(req, res, { public: publicPath });
  } else {
    // Serve index.html for React Router routes
    res.setHeader('Content-Type', 'text/html');
    res.end(readFileSync(join(publicPath, 'index.html')));
  }
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
