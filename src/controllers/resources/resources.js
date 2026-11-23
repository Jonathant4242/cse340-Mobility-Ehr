import { getAllResources, getResourceBySlug } from '../../models/resources/resources.js';

export const resourceListPage = (req, res) => {
  res.render('resources/resources', {
    title: 'Patient Resources',
    patientResources: getAllResources(),
  });
};

export const resourceDetailPage = (req, res, next) => {
  const resource = getResourceBySlug(req.params.slug);

  if (!resource) {
    return next();
  }

  res.render('resources/resource-detail', {
    title: resource.title,
    resource,
  });
};
