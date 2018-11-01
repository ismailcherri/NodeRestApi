const environments = {};

// Staging
environments.staging = {
    httpPort: 3000,
    httpsPort: 3001,
    envName: 'staging'
};

// Production
environments.production = {
    httpPort: 5000,
    httpsPort: 5001,
    envName: 'production'
};

// Select the correct environment
const currentEnvironment = typeof(process.env.NODE_ENV) === 'string'
    ? process.env.NODE_ENV.toLowerCase()
    : '';

// Determine the environment to export
const environmentToExport = typeof(environments[currentEnvironment]) === 'object'
    ? environments[currentEnvironment]
    : environments.staging;

module.exports = environmentToExport;