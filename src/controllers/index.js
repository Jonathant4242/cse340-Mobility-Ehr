export const homePage = (req, res) => {
  res.render('home', { title: 'Mobility EHR' });
};

export const aboutPage = (req, res) => {
  res.render('about', { title: 'About Mobility EHR' });
};
