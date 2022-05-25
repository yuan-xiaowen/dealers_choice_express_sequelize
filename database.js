const Sequelize = require('sequelize')
const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/cupcake')

 const cupcake = db.define('cupcake',{
         name:{
           type:Sequelize.STRING,
            allowNull:false,
            validate:{
                notEmpty:true
            },
            unique:true
        },
        price:{
            type:Sequelize.INTEGER,
            allowNull:false,
            validate:{
                notEmpty:true
            },
            unique:true
        },   
        image:{
            type:Sequelize.STRING,
            allowNull:false},       
    })
    
    const customer = db.define('customer',{
        name:{
            type:Sequelize.STRING,
            allowNull:false
        }
    })
    
    const order = db.define('order',{
        quantity:{
            type:Sequelize.INTEGER,
            allowNull:false
        },
        total:{
            type:Sequelize.INTEGER,
            allowNull:false
        }
    })
    
    order.belongsTo(cupcake)
    order.belongsTo(customer)

    const setUp = async()=>{
        await db.sync({force:true})
        const [chocolate,redvelvet,Tom,Amy] = await Promise.all(
                          [cupcake.create({name:'chocolate',price:4,image:'chocolate.png'}),
                           cupcake.create({name:'redvelvet',price:3,image:'red.png'}),
                           customer.create({name:'Tom'}),
                           customer.create({name:'Amy'})])
     
     }
    

module.exports = {db,cupcake,customer,order,setUp}
     
     