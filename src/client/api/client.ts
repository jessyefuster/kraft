import ky from 'ky';

const client = ky.extend({
  prefixUrl: '/api',
  hooks: {
    beforeRequest: [
      () => {
        // Do something before every request
        // This is a good place to authorize request if needed
      }
    ],
    afterResponse: [
      () => {
        // Do something after every response
        // For example, check status code etc...
      }
    ]
  }
});

export default client;
