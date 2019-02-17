const mariadb= require ('mariadb')

const connectionPool = mariadb.createPool({
    host: 'c9cujduvu830eexs.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user: 'v7vo5l5pdijuknqs',
    password: 'mktw7ofzbcwhuodz',
    database : 'eequmromf5d3lg7l',
    connectionLimit: 5
  })


  module.exports= connectionPool