const mariadb= require ('mariadb')

const connectionPool = mariadb.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '123456789',
    database : 'sistemasC&C',
    connectionLimit: 5
  })


  module.exports= connectionPool