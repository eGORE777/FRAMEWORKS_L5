const theaterController = require('../../controllers/theaterController');  

exports.theaterRoutes = (server) => {  
  server.registerRoute('GET', '/api/v1/events', theaterController.getAllEvents);  
  server.registerRoute('GET', '/api/v1/events/:id', theaterController.getEventById);  
  server.registerRoute('POST', '/api/v1/events', theaterController.addEvent);  
};  