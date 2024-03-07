export const CProtectedRoutes = [
  '/',
  '/account',
  '/benefits',
  '/campaigns',
  // '/campaigns/manage',
  '/clients',
  '/discover/clients',
  '/discover/influencers',
  '/users/clients',
  '/users/ambassadors',
  '/users/influencers',
  '/finance',
  '/help',
  '/income',
  '/reports',
  '/reports/manage',
  '/search',
  '/sml',
  '/sml/create',
  '/services/campaigns',
  '/services/campaigns/manage',
  '/services/campaigns/inpreparation',
  '/services/campaigns/ongoing',
  '/services/reports',
  // '/services/reports/manage',
  '/services/sml',
  '/services/sml/reports',
  '/services/sml/manage',
  '/services/surveys',
  '/services/surveys/manage',
  '/services/benefits',
  '/surveys',
  '/testpage',

  // '/surveys/create',
];

// '/campaigns/manage',
export const CProtectedDynamicRoutes = [
  '/testpage/',
  '/services/campaigns/manage/',
  '/services/surveys/create/',
  '/services/surveys/manage/',
  '/surveys/questionnaire/',
  '/surveys/create/',
  '/surveys/participants/',
  '/campaigns/',
  '/services/surveys/',
  '/surveys/',
];

export const CUnprotectedRoutes = [
  '/login',
  '/register',
  '/reset-password',
  '/email-confirmation',
];

export const CMiscRoutes = ['/_/code'];

export const CAllRoutes = [
  ...CProtectedRoutes,
  ...CUnprotectedRoutes,
  ...CMiscRoutes,
];
