const Project = {
  name: 'Patients Influence',
  version: '1.0.0',
  app: {
    // environment: 'production',
    environment: 'staging',
    // environment: 'development',

    baseUrl: 'http://localhost',
    baseProdUrl: 'https://app.patientsinfluence.com',
    baseStageUrl: 'https://app.staging.patientsinfluence.com',
  },
  apis: {
    // Production
    // v1: 'https://api.patientsinfluence.com',
    // Staging
    v1: 'https://api.staging.patientsinfluence.com',
    // Local/Dev
    // v1: 'http://localhost:3000',
  },
  socket: {
    // production
    productionSocket: `wss://socket.patientsinfluence.com`,
    // staging
    stagingSocket: `wss://socket.staging.patientsinfluence.com`,
    // development
    developmentSocket: `ws://localhost:3001`,
  },

  title: {
    prefix: '',
    sufix: ' | Patients Influence',
  },
};

export default Project;
