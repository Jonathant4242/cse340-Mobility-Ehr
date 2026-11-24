import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import routes from './src/controllers/routes.js';
import { logRequest, notFound, errorHandler } from './src/middleware/global.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Configure EJS and serve static files from public.
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));
app.use(express.static(path.join(__dirname, 'public')));

if (app.get('env') === 'development') {
  app.use(logRequest);
}

app.use(routes);
app.use(notFound);
app.use(errorHandler);

// Start the server.
app.listen(port, (error) => {
  if (error) {
    console.error('Unable to start Mobility EHR:', error.message);
    process.exitCode = 1;
    return;
  }

  console.log(`Mobility EHR is running at http://localhost:${port}`);
});
