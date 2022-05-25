const express = require('express')
const router = express.Router()
const Sequelize = require('sequelize')
const {cupcake,customer,order} = require('./database.js')

router.get('/',(req,res,next)=>{
    try{
      res.redirect('/cupcake')
    }catch(err){
        next(err)
    }
})

router.get('/cupcake',async(req,res,next)=>{
    try{
      const cakes = await cupcake.findAll()
      res.send(`
      <html>
        <head>
          <link rel="stylesheet" href="main.css">
          <title>cupcake</title>
        </head>
        <body>
          <h1>c u p c a k e</h1>
          <form method = 'POST'>
            <label>cupcake</lable>
            <input name ='cupcake'/>
            <label>price</lable>
            <input name ='price'/>
            <button>submit</button>
          </form>
          <ul id ='cupcake'>
            ${cakes.map(cake=>{
                return `<li>
                <img src=${cake.image} >
                <p>${cake.name}
                 price:$${cake.price}</p>
                </li>`
            }).join('')}
          </ul>
          <ul><a href='/order'>Go To Cart</ul>
        </body>
      </html>
      `)
    }catch(err){
        next(err)
    }
})

router.get('/customer',async(req,res,next)=>{
    try{
      const people = await customer.findAll()
      res.send(`
      <html>
        <head>
          <link rel="stylesheet" href="main.css">
          <title>customer</title>
        </head>
        <body>
          <h1>c u s t o m e r</h1>
          <form method = 'POST'>
            <label>name</lable>
            <input name ='name'/>
            <button>submit</button>
          </form>
          <ul>
            ${people.map(person=>{
                return `<li>${person.name}</li>`
            }).join('')}
          </ul>
          <ul><a href='/order'>Go To Cart</ul>
        </body>
      </html>
      `)
    }catch(err){
        next(err)
    }
})

router.get('/order',async(req,res,next)=>{
    try{
      const cakes = await cupcake.findAll()
      const people = await customer.findAll()
      const lists= await order.findAll({include:[cupcake,customer]})
      res.send(`
      <html>
        <head>
          <link rel="stylesheet" href="main.css">
          <title>order</title>
        </head>
        <body>
          <h1>o r d e r</h1>
            <h2>place order</h2>
            <form method = 'POST'>
            <label for="cupcake">cupcake:</label>
            <select name="cupcake">
            ${cakes.map(cake=>{
                return `<option value="${cake.id}">${cake.name}</option>`
            })}
            </select>
            <label for="quantity">quantity:</label>
            <select name="quantity">
            <option value=1>1</option>
            <option value=2>2</option>
            <option value=3>3</option>
            <option value=4>4</option>
            </select>
            <label for="customer">customer:</label>
            <select name="customer">
            ${people.map(person=>{
                return `<option value="${person.id}">${person.name}</option>`
            })}
            </select>
            <button>submit</button>
        </form>
          <h2>order history</h2>
          <ul> 
          ${lists.map(list=>{
            return `<li><form  method ='POST' action='/order/${list.id}?_method=DELETE'>
            ${list.customer.name} ${list.quantity} ${list.cupcake.name} cupcake total:$${list.total}
              <button>x</button>
            </form>
            </li>`
          }).join('')}
          </ul>
          <ul>
          <a href='/cupcake'>back to cupcake</a> 
          </ul>
          <ul>
          <a href='/customer'>back to customer</a>
          </ul>
        </body>
      </html>
      `)
    }catch(err){
        next(err)
    }
})

router.post('/cupcake',async(req,res,next)=>{
  try{
    let img = ''
   if (req.body.cupcake === 'chocolate'){
      img = 'chocolate.png'
   }else if (req.body.cupcake === 'redvelvet'){
      img = 'red.png'
   }else{
      img = 'other.png'
   }
   await cupcake.create({name:req.body.cupcake,price:req.body.price, image:img})
   res.redirect('/cupcake')
  }catch(err){
      next(err)
  }
})

router.post('/customer',async(req,res,next)=>{
  try{
    await customer.create({name:req.body.name})
    res.redirect('/customer')
  }catch(err){
      next(err)
  }
})

router.post('/order',async(req,res,next)=>{
    try{
     const cake = await cupcake.findByPk(req.body.cupcake)
     const price = cake.price
     await order.create({cupcakeId:cake.id,customerId:req.body.customer, quantity:req.body.quantity, total:req.body.quantity*price})
     res.redirect('/order')
    }catch(err){
        next(err)
    }
})

router.delete('/order/:id',async(req,res,next)=>{
  try{
    const id = req.params.id
    const row = await order.findByPk(id)
    await row.destroy()
    res.redirect('/order')
  }catch(err){
    next(err)
  }
})

module.exports = router