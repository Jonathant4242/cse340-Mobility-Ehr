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

export const getAllResources = () => structuredClone(patientResources);

export const getResourceBySlug = (slug) => {
  if (!Object.hasOwn(patientResources, slug)) {
    return null;
  }

  return structuredClone(patientResources[slug]);
};
