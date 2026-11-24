// Home page handler
export const homePage = (req, res) => {
  res.render('home', { title: 'Mobility EHR' });
};

// About page handler
export const aboutPage = (req, res) => {
  res.render('about', { title: 'About Mobility EHR' });
};

// Account setup page handler
export const accountSetupPage = (req, res) => {
  res.render('forms/account-setup/form', {
    title: 'Set up your patient account',
  });
};