const express = require ('express')
const {sqlQuery} = require('../config/general')
const router = express.Router()

 router.get("/paises", async function(req, res){

  try {
    const qryPaises = `
    select 
      id,
      nombre
    from paises
    where fecha_eliminado is null
  `

  const result = await sqlQuery(qryPaises)

  res.status(200).json(result)

  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
  


 })

 router.get('/pais-depts/:paisId', async function(req, res){

  try {
    
    const paisId = req.params.paisId

    if(paisId === 'undefined' || paisId === null || paisId === '')
      res.status(400).json({exitoso: false, error: 'campos incompletos'})

    const qryDepartamentos = `
      select
        id,
        nombre
      from departamentos
      where fecha_eliminado is null
        and paisId = :paisId
    `

    const params = {paisId}

    const result = await sqlQuery(qryDepartamentos, params)

    res.status(200).json({exitoso: true, result : result})

  } catch (error) {
    res.status(500).json(error)
  }

 })

 router.get('/departamentos-ciudades/:departamentoId', async function(req, res){

  try {
    
    const departamentoId = req.params.departamentoId

    if(departamentoId === 'undefined' || departamentoId === null || departamentoId === '')
      res.status(400).json({exitoso: false, error: 'campos incompletos'})

    const qryCiudades = `
      select
        id,
        nombre
      from ciudades
      where fecha_eliminado is null
        and departamentoId = :departamentoId
    `

    const params = {departamentoId}

    const result = await sqlQuery(qryCiudades, params)

    res.status(200).json({exitoso: true, result : result})

  } catch (error) {
    res.status(500).json(error)
  }

 })

 // exportar este archivo INDEX/para utilizarlo en cualquier parte de la aplicacion

 module.exports = router
