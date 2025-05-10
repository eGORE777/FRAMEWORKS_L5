const db = require('../db/db');  


exports.getAllPerformances = () => {  
  return db.getAll('performances');  
};  


exports.getPerformanceById = (id) => {  
  return db.getById('performances', id);  
};  


exports.addPerformance = (performance) => {  
  return db.add('performances', performance);  
};  


exports.updatePerformance = (id, updates) => {  
  return db.update('performances', id, updates);  
};  


exports.deletePerformance = (id) => {  
  return db.delete('performances', id);  
};  