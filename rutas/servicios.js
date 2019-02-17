const express = require('express')
const router = express.Router()
const {sqlQuery, valorValido} = require('../config/general')
const multer = require('multer')
const fs = require('fs')

const storage = multer.diskStorage({
    destination: function(req, file, callback){
        const tipo = req.body.imageType
        callback(null, './files/images/'+tipo)
    },
    filename: async function (req, file, cb) {
        let name = req.body.id
        
        if(!name){
            name = Date.now()
        }

        cb(null, name + '.jpg')
    }
})

const fileUploader = multer({storage, limits: {
    fileSize: 1024 * 1024*  2 // 2 MB
}})

router.get('/', async function(req, res){

    // buscar todos los servicios en la base de datos
    try {
        const qryServicios= `
        select 
            s.id,
            s.nombre, 
            s.enlace,
            s.descripcion as descripción_servicio, 
            s.tipoServicioId,
            ts.descripcion as descripción_tiposervicio
        from servicios s
            inner join tipo_servicios ts
                    on ts.id = s.tipoServicioId
                   and ts.fecha_eliminado is null
        where s.fecha_eliminado is null
        `
    
        const resultados = await sqlQuery(qryServicios)
    
        res.status(200).json({exitoso: true, resultados})
    
    } catch (error) {
        console.log(error)
        res.status(500).json({exitoso: false})
    }
}) 

router.post('/editar', fileUploader.single('imagen'), async function(req, res){

    const id = req.body.id
    const nombre = req.body.nombre
    const enlace = req.body.enlace
    const descripcion = req.body.descripcion
    const tipoServicioId = req.body.tipoServicioId

    if(!valorValido(id)){
        return res.status(400).json({exitoso: false, error: 'id no valido'})
    }
    
    try {
        const qryEditar=
        `Update servicios Set 
            nombre = :nombre, 
            enlace = :enlace,
            descripcion = :descripcion,
            tipoServicioId = :tipoServicioId
         Where id= :id`

    const params={id,nombre,tipoServicioId,enlace,descripcion,}

    const resultados = await sqlQuery(qryEditar, params)
        
    res.status(200).json({exitoso: true, resultados})

} catch (error) {
     console.log(error)
    res.status(500).json({exitoso: false})
}
})


router.post('/eliminar', async function(req, res){

    const id = req.body.id

    console.log(id)

    if(!valorValido(id)){
        return res.status(400).json({exitoso: false, error: 'id no valido'})
    }
    
    try {
        const qryEliminado=
        `update servicios
            set fecha_eliminado= now() 
        where id = :id`

    const params={id}

    const resultados = await sqlQuery(qryEliminado, params)
        
    res.status(200).json({exitoso: true, resultados})

} catch (error) {
     console.log(error)
    res.status(500).json({exitoso: false})
}
})

// crear SERVICIOS
router.post('/crear_servicio', fileUploader.single('imagen'), async function(req, res){

    try {
        const nombre=req.body.nombre
        const descripcion=req.body.descripcion
        const tipoServicioId=req.body.tipoServicioId
        

        if(!nombre || !descripcion || !tipoServicioId ){
            return res.status(400).json({exitoso: false, error: 'campos incompletos'})
        }

        const qryCrearServicio=`
            insert into servicios(nombre,descripcion,tipoServicioId)
                values (:nombre,:descripcion,:tipoServicioId)
        `
    
       const params={nombre,descripcion, tipoServicioId}

       const resultado = await sqlQuery(qryCrearServicio,params)

       if (req.file){
        const filename = 'files/images/servicios/'+resultado.insertId+'.jpg'
        fs.rename(req.file.path, filename, function(error, data) {
            if (error) {
                console.log(error);
                return;
            }
        })
    }
        
       res.status(200).json({exitoso: true})

    } catch (error) {
         console.log(error)
        res.status(500).json({exitoso: false})
    }
})
    
router.get('/tipo-servicios', async function(req, res){
    try {
        const querytipo_servicios =
        'select id , descripcion from tipo_servicios'

        const tipo_servicios = await sqlQuery(querytipo_servicios)

        res.status(200).json({exitoso: true, tipo_servicios})

    } catch (error) {
        console.log(error)
        res.status(500).json({exitoso: false})
   }
})

router.get('/:id', async function(req, res){

    const id = req.params.id
    
    if(!id){
        return res.status(400).json({exitoso: false, error: 'id no encontrado'})
    }

    try{
        const qryId= `
        select Id, nombre, descripcion, fecha_creado
        from servicios 
        where id = :id and fecha_eliminado is null
        `
          const params = {id}

          const resultados = await sqlQuery(qryId, params)

          if (resultados.length == 0 ){
            return res.status(400).json({exitoso: false, error: 'no encontrado'})
        }

        res.status(200).json({exitoso: true, resultados})

    } catch (error) {
         console.log(error)
        res.status(500).json({exitoso: false})
    }   
})
router.get('/explorar/:tipoServicio', async function(req, res){

    const tipoServicio = req.params.tipoServicio

    const qryServicios = `
    select 
    s.id,
    s.nombre, 
    s.enlace,
    s.descripcion as descripción_servicio, 
    s.tipoServicioId,
    ts.descripcion as descripción_tiposervicio
from servicios s
    inner join tipo_servicios ts
            on ts.id = s.tipoServicioId
           and ts.fecha_eliminado is null
where s.fecha_eliminado is null
and ts.id = :tipoServicio
    `

    try {
        const servicios = await sqlQuery(qryServicios, {tipoServicio})
        
        res.status(200).json({exitoso: true, servicios})
           
    } catch (error) {
        console.log(error)
        res.status(500).json({exitoso: false})
    }

})


module.exports = router
