const express = require('express');
const router = express.Router();



// Database
const {database} = require('../config/helpers')

/* GET ALL PRODUCTS */
router.get('/', function(req, res){
  
  let page = (req.query.page != undefined && req.query.page != 0) ? req.query.page: 1; // set current page number
  const limit = (req.query.page != undefined && req.query.page != 0) ? req.query.limit: 10; // set limit of items per page

  let startValue;
  let endValue;

  if (page > 0)
  {
    startValue = (page * limit) - limit;
    endValue = page * limit;
  }else
  {
    startValue = 0;
    endValue = 10;
  }

  database.table('products as p')
  .join([{
    table: 'categories as c',
    on: 'c.id = p.cat_id'
  }])
  .withFields ([
    'c.title as Category',
    'p.title as Name',
    'p.price',
    'p.quantity',
    'p.image',
    'p.id'
  ])
  .slice(startValue, endValue)
  .sort({id: .1})
  .getAll()
  .then(prods =>{
    if(prods.length > 0)
    {
      res.status(200).json({
        count: prods.length,
        products: prods
      })
    }else{
      res.status(404).json({message: 'No products found.'});
    }
  }).catch(err => console.log(err));

  
});


/* GET SINGLE PRODUCT */
router.get('/:proid', function(req, res){

  
  let productId = req.params.proid; // get product id from params
  
  database.table('products as p')
  .join([{
    table: 'categories as c',
    on: 'c.id = p.cat_id'
  }])
  .withFields ([
    'c.title as Category',
    'p.title as Name',
    'p.price as Price',
    'p.quantity as Stock',
    'p.image as Image',
    'p.images as Images',
    'p.id'
  ])
  .filter({'p.id' : productId})
  .get()
  .then(prod =>{
    if(prod)
    {
      res.status(200).json({prod})
    }else{
      res.status(404).json({message: `No record found for product with ID ${productId}.`});
    }
  }).catch(err => console.log(err));

  
})


/* GET ALL PRODUCTS IN A PARTICULAR CATEGORY */
router.get('/category/:catName', function(req, res){
  
  const category = req.params.catName;  //Get category name from params
  
  let page = (req.query.page != undefined && req.query.page != 0) ? req.query.page: 1; // set current page number
  const limit = (req.query.page != undefined && req.query.page != 0) ? req.query.limit: 10; // set limit of items per page

  let startValue;
  let endValue;

  if (page > 0)
  {
    startValue = (page * limit) - limit;
    endValue = page * limit;
  }else
  {
    startValue = 0;
    endValue = 10;
  }

  database.table('products as p')
  .join([{
    table: 'categories as c',
    on: `c.id = p.cat_id WHERE c.title LIKE '%${category}%'`
  }])
  .withFields ([
    'c.title as Category',
    'p.title as Name',
    'p.price as Price',
    'p.quantity as Stock',
    'p.image as Image',
    'p.id'
  ])
  .slice(startValue, endValue)
  .sort({id: .1})
  .getAll()
  .then(prods =>{
    if(prods.length > 0)
    {
      res.status(200).json({
        count: prods.length,
        products: prods
      })
    }else{
      res.status(404).json({message: `No products found in ${category} category`});
    }
  }).catch(err => console.log(err));

  
});



module.exports = router;
