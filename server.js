const express = require("express")
const override = require('method-override')
const app = express()
const router = require('./router.js')
const {setUp} = require('./database.js')

app.use(express.urlencoded())
app.use(override('_method'))
app.use(express.static('./public'))
app.use(router)

const init = async()=>{
  try{
    await setUp()
  }catch(err){
    console.log(err)
  }
}
init()

const port = process.env.PORT || 3000
app.listen(port,()=>{
    console.log(`App is listening at port:${port}`)
})
