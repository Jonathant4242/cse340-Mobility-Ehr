// Import necessary modules and set up the Express app
import express from 'express';
import { STATUS_CODES } from 'node:http';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Get the current file name and directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 3000;

// Messages shown to users; technical error details stay in the terminal.
const errorPages = {
  // A form or other request contains invalid data.
  400: { title: 'Invalid request', message: 'Please check your information and try again.' },
  // A protected route requires the user to log in.
  401: { title: 'Login required', message: 'Please log in to access this page.' },
  // The logged-in user does not have the required role or permission.
  403: { title: 'Access denied', message: 'You do not have permission to access this page.' },
  // The requested page or record cannot be found.
  404: { title: 'Page not found', message: 'We couldn’t find the page or record you requested.' },
  // An unexpected server failure; never show its technical details to the user.
  500: { title: 'Something went wrong', message: 'We couldn’t complete your request. Please try again later.' },
};

// Set up view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('home', { title: 'Mobility EHR' });
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About Mobility EHR' });
});

// Show the 404 page when no route matches.
app.use((req, res, next) => {
  next(Object.assign(new Error('Route not found'), { status: 404 }));
});

// Express sends errors from routes and middleware to this four-argument handler.
// For example, a form can call next(Object.assign(new Error('Invalid form data'), { status: 400 })).
app.use((error, req, res, next) => {
  const requestedStatus = error.status || error.statusCode;
  const status = Number.isInteger(requestedStatus) && requestedStatus >= 400 && requestedStatus <= 599
    ? requestedStatus
    : 500;

  if (status >= 500) {
    console.error(error);
  }

  if (res.headersSent) {
    return next(error);
  }

  const { title, message } = errorPages[status] || {
    title: STATUS_CODES[status] || 'Request failed',
    message: 'We couldn’t complete your request.',
  };
  const view = status === 404 ? 'errors/404' : 'errors/error';

  res.status(status).render(view, { status, title, message }, (renderError, html) => {
    if (renderError) {
      console.error(renderError);
      return res.status(500).type('text').send('Internal Server Error');
    }
    res.send(html);
  });
});

app.listen(port, (error) => {
  if (error) {
    console.error('Unable to start Mobility EHR:', error.message);
    process.exitCode = 1;
    return;
  }

  console.log(`Mobility EHR is running at http://localhost:${port}`);
});
