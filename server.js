import express from 'express';
import { STATUS_CODES } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Patient guides for preparing for the first visit, tracking therapist-assigned exercises, and discussing progress with the therapist.
const patientResources = {
  'first-visit': {
    title: 'Preparing for your first visit',
    description: 'Write down what brings you to therapy and any questions you want to ask.',
  },
  'home-program-log': {
    title: 'Your home program after your visit',
    description: 'Once your therapist assigns your home program, use a log to track the exercises you complete and any questions for your next visit.',
  },
};

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

// Configure EJS and serve static files from public.
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('home', { title: 'Mobility EHR' });
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About Mobility EHR' });
});

app.get('/resources', (req, res) => {
  res.render('resources', { title: 'Patient Resources', patientResources });
});

// Handle 404 errors for unmatched routes.
app.use((req, res, next) => {
  next(Object.assign(new Error('Route not found'), { status: 404 }));
});

// Handle other errors.
app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const requestedStatus = error.status ?? error.statusCode;
  let status = 500;
  if (Number.isInteger(requestedStatus) && requestedStatus >= 400 && requestedStatus <= 599) {
    status = requestedStatus;
  }

  if (status >= 500) {
    console.error(error);
  }

  const { title, message } = errorPages[status] || {
    title: STATUS_CODES[status] || 'Request failed',
    message: 'We couldn’t complete your request.',
  };
  const view = status === 404 ? 'errors/404' : 'errors/error';

  res.status(status).render(view, { title, status, message }, (renderError, html) => {
    if (renderError) {
      console.error(renderError);
      return res.status(500).type('text').send('Internal Server Error');
    }

    res.send(html);
  });
});

// Start the server.
app.listen(port, (error) => {
  if (error) {
    console.error('Unable to start Mobility EHR:', error.message);
    process.exitCode = 1;
    return;
  }

  console.log(`Mobility EHR is running at http://localhost:${port}`);
});