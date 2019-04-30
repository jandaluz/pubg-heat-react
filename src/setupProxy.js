const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  var gcpOptions = {
    target: 'https://storage.googleapis.com',
    changeOrigin: true,
    logLevel: 'debug'
  };
  var ghOptions = {
    target: "https://raw.githubusercontent.com",
    changeOrigin: true,
    pathRewite: function (path, req) { 
      console.log('path', path);      
      return path.replace('/assets', '/base/api') 
    },
    logLevel: 'debug'
  };

  app.use(proxy('/pubg-hackathon-published', gcpOptions));
  app.use(proxy('/assets', ghOptions));
};