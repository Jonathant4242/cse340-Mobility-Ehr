import { STATUS_CODES } from 'node:http';

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

export const logRequest = (req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
};

// Handle 404 errors for unmatched routes.
export const notFound = (req, res, next) => {
  next(Object.assign(new Error('Route not found'), { status: 404 }));
};

// Handle other errors.
export const errorHandler = (error, req, res, next) => {
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
};
