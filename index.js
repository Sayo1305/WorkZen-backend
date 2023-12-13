// app.js
const express = require('express');
require('dotenv').config();
const app = express();
const port = 8080;


// require routes
require('./routes')(app);


app.get("/" , (req ,res)=>{
      return res.status(200).json({ok : true , data : "backend working"});
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
