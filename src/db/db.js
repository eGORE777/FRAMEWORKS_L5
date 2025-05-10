const fs = require('fs');  
const path = require('path');  

const dbPath = path.join(__dirname, 'db.json');  


exports.getAll = () => {  
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));  
  return data.events;  
};  


exports.getById = (id) => {  
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));  
  return data.events.find(item => item.id === id); 
};  


exports.add = (item) => {  
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));  

  const newId = (data.events.length > 0) ? data.events[data.events.length - 1].id + 1 : 1; 
  const newItem = { ...item, id: newId }; 
  data.events.push(newItem);  
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');  
  return newItem;  
};  