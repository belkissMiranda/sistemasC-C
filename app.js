const express = require('express');
const app = express();
const bodyparser= require('body-parser')
//const rutas = require('./rutas')
const productos = require('./rutas/productos')
const usuarios = require('./rutas/usuarios')
const servicios = require('./rutas/servicios')
const index = require('./rutas/index')
const contact = require('./rutas/contact')

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({
  extended:true
}))

app.use('/files', express.static('files'))

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
  
  next()
}) 
const port = process.env.PORT || 3000

app.listen(port, function () {
  console.log('Example app listening on port 3000!');

  app.use('/', index)
  app.use('/usuarios',usuarios)
  app.use('/productos',productos)
  app.use('/servicios',servicios)
  app.use('/contact', contact)
});
//

  
  
 


