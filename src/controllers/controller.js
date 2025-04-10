const theaterService = require('../services/theaterService');  

exports.getAllEvents = (req, res) => {  
  const events = theaterService.getAllExhibits(); 
  res.writeHead(200, { 'Content-Type': 'application/json' });  
  res.end(JSON.stringify(events));  
};  

exports.getEventById = (req, res) => {  
  const event = theaterService.getExhibitById(req.params.id); 
  if (event) {  
    res.writeHead(200, { 'Content-Type': 'application/json' });  
    res.end(JSON.stringify(event));  
  } else {  
    res.writeHead(404, { 'Content-Type': 'application/json' });  
    res.end(JSON.stringify({ message: 'Событие не найдено' }));
  }  
};  

exports.addEvent = (req, res) => {  
  let body = '';  
  req.on('data', chunk => {  
    body += chunk; 
  });  
  req.on('end', () => {  
    const newEvent = JSON.parse(body);  
    const addedEvent = theaterService.addExhibit(newEvent); 
    res.writeHead(201, { 'Content-Type': 'application/json' });  
    res.end(JSON.stringify(addedEvent));  
  });  
};  
