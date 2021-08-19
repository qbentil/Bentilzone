const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  includes(res);
  res.send('respond with a resource');
});

function includes(res)
{
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200")
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type, Authorization, Origin, X-Requested-with, Accept");
  res.setHeader( "Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" );  
}
module.exports = router;
