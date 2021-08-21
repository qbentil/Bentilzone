const express = require('express');
const router = express.Router();

// Database
const {database} = require('../config/helpers');

/* GET ALL ORDERS */
router.get('/', function(req, res){
  
  // CORS
  includes(res);
  
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

  database.table('orders_details as d')
  .join([
    {
      table: 'orders as o',
      on: 'o.id = d.order_id'
    },
    {
      table: 'products as p',
      on: 'p.id = d.product_id'
    },
    {
      table: 'users as u',
      on: 'u.id = o.uid'
    }
  ])
  .withFields ([
    'o.id',
    'p.title as Name',
    'p.description',
    'p.price',
    'u.username',
  ])
  .slice(startValue, endValue)
  .sort({id: 1})
  .getAll()
  .then(orders =>{
    if(orders.length > 0)
    {
      res.status(200).json({
        count: orders.length,
        products: orders
      })
    }else{
      res.status(404).json({message: 'No Order found.'});
    }
  }).catch(err => console.log(err));

  
});

/* GET SINGLE ORDER */
router.get('/:oid', function(req, res){

  // CORS
  includes(res);
  let orderId = req.params.oid; // get product id from params
  
  database.table('orders_details as d')
  .join([
    {
      table: 'orders as o',
      on: 'o.id = d.order_id'
    },
    {
      table: 'products as p',
      on: 'p.id = d.product_id'
    },
    {
      table: 'users as u',
      on: 'u.id = o.uid'
    }
  ])
  .withFields ([
    'o.id',
    'p.title as Name',
    'p.description',
    'p.price',
    'u.username',
  ])
  .filter({'o.id': orderId})
  .get()
  .then(orders =>{
    if(orders)
    {
      res.status(200).json({orders})
    }else{
      res.status(404).json({message: `No orders found with order ID ${orderId}`});
    }
  }).catch(err => console.log(err));

})


/* MAKING NEW ORDER */
router.post("/new", (req, res) =>{
  
  // CCORS
  includes(req)
  
  let {userid, products} = req.body;

  if(userid != 0 && userid > 0 && !isNaN(userid))
  {
    database.table('orders')
    .insert({
      uid: userid 
    }).then(newOrderId =>{
      
      if(newOrderId > 0)
      {
        products.forEach(async (p) => {
          
          let data = await database.table('products').filter({id: p.id}).withFields(['quantity']).get();

          let inCart = p.incart;

          //Deduct products quatity in stock from database
          if(data.quantity > 0)
          {
            data.quantity -= inCart;
            
            if(data.quantity < 0)
            {
              data.quantity = 0;
            }
          }else{
            data.quantity = 0;
            // return;
          }


          // INSERT ORDER DETAIL W.R.T NEW ORDER ID
          database.table('orders_details')
          .insert({
            order_id: newOrderId,
            product_id: p.id,
            quatity: inCart
          }).then(newId =>{
            
            // UPDATE PRODUCT QUANTITY
            database.table('products')
            .filter({id: p.id})
            .update({
              quatity: data.quantity
            }).then(successNum =>{}).catch(err => console.log(err))
            
          }).catch(err => console.log(err))
          
        });
      }else{
        res.json({message: 'New order failded by adding order datails'})
      }

      res.status(200).json({
        message: `Order successful with order ID: ${newOrderId}`,
        success: true,
        order_id: newOrderId,
        products: products
      });
      
    }).catch(err => console.log(err))
  }
  res.status(424).json({
    message: `Order Failed`,
    success: false
  });
  
})

/* FAKE PAYMENT GATEWAY CALL */
router.post('/payment', (req, res) => {
  // includes(res) {Uses Request}
  includes(req)
  setTimeout( () => {
    res.status(200).json({success: true});
  }, 3000)
})



module.exports = router;


// Cors Bug Fix

function includes(res)
{
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Preflight-Continue", false); //Preflight-Continue
  res.setHeader("Access-Control-Allow-Headers", "content-type, Authorization, Origin, X-Requested-with, Accept");
  res.setHeader( "Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" );  
}