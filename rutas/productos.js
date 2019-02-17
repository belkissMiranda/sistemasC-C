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

router.get('/tipo_producto', async function(req, res){
    try {
        const querytipo_producto=
        'select id , descripcion from tipo_producto'

        const tipo_producto = await sqlQuery(querytipo_producto)

        res.status(200).json({exitoso: true, tipo_producto})
    } catch (error) {
        console.log(error)
       res.status(500).json({exitoso: false})
   }
})

router.post('/eliminar', async function(req, res){

    const id = req.body.id

    if(!valorValido(id)){
        return res.status(400).json({exitoso: false, error: 'id no valido'})
    }
    
    try {
        const qryEliminado=
        `update productos
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

router.post('/editar', fileUploader.single('imagen'), async function(req, res){

    const id = req.body.id
    const nombre = req.body.nombre
    const modelo = req.body.modelo
    const tipoProductoId = req.body.tipoProductoId
    const enlace = req.body.enlace
    const descripcion = req.body.descripcion
    const tipoSegmentoId = req.body.tipoSegmentoId

    if(!valorValido(id)){
        return res.status(400).json({exitoso: false, error: 'id no valido'})
    }
    
    try {
        const qryEditar=
        `Update Productos Set 
            nombre = :nombre, 
            Modelo = :modelo,
            tipoProductoId = :tipoProductoId, 
            enlace = :enlace,
            descripcion = :descripcion,
            tipoSegmentoId = :tipoSegmentoId
         Where id= :id`

    const params={id,nombre,modelo,enlace,tipoProductoId,enlace,descripcion,tipoSegmentoId}

    const resultados = await sqlQuery(qryEditar, params)
        
    res.status(200).json({exitoso: true, resultados})

} catch (error) {
     console.log(error)
    res.status(500).json({exitoso: false})
}
})

router.get('/', async function(req, res){

// buscar todos los productos en la base de datos
try {
    const qryProducto= `
        select 
        p.id,
        p.nombre, 
        p.modelo, 
        p.enlace,
        p.descripcion as descripcion_producto, 
        p.tipoProductoId, 
        tp.descripcion as descripcion_tipo_producto,
        p.tipoSegmentoId, 
        ts.descripcion as descripcion_segmento
    from productos p
    inner join tipo_producto tp 
            on tp.id =p.tipoProductoId
        and tp.fecha_eliminado is null
    inner join tipo_segmentos ts 
            on ts.id=p.tipoSegmentoId 
        and ts.fecha_eliminado is null
    where p.fecha_eliminado is null`

    const resultados = await sqlQuery(qryProducto)

    res.status(200).json({exitoso: true, resultados})

} catch (error) {
    console.log(error)
    res.status(500).json({exitoso: false})
}
})

// crear productos
router.post('/crear_producto', fileUploader.single('imagen'), async function(req, res){
    try {
        const nombre= req.body.nombre
        const modelo= req.body.modelo
        const tipoProducto=req.body.tipoProductoId
        const descripcion=req.body.descripcion
        const segmentoId=req.body.segmentoId
        const enlace=req.body.enlace

        const qryCrearProducto=`
        insert into productos(nombre,Modelo,tipoProductoId,descripcion,tipoSegmentoId,enlace)
        values (:nombre,:modelo,:tipoProducto,:descripcion,:segmentoId,:enlace)`

       const params={ nombre,modelo,tipoProducto,descripcion,segmentoId,enlace}

       const resultado= await sqlQuery(qryCrearProducto,params)
        
        if (req.file){
            const filename = 'files/images/productos/'+resultado.insertId+'.jpg'
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

// CREAR TIPO DE PRODUCTOS
router.get('/crear_tipo_producto', async function(req, res){

    try{
        const nombre = "accesorios latop"

        if(nombre == "" || nombre == "undifined"){
            return res.status(500).json({exitoso: false})
        }

        const qryCrear = `
            insert into tipo_producto(descripcion)
                values(:nombre)
        `
        const params = {nombre}

        const resultado = await sqlQuery(qryCrear, params)

        res.status(200).json({exitoso: true})

    }catch(error){
        console.log(error)
        res.status(500).json({exitoso: false})
    }
})

router.get('/tipo_segmentos', async function(req, res){
    try {
        const querytipo_segmentos=
        'select id , descripcion from tipo_segmentos'

        const tipo_segmentos = await sqlQuery(querytipo_segmentos)

        res.status(200).json({exitoso: true, tipo_segmentos})
    } catch (error) {
        console.log(error)
       res.status(500).json({exitoso: false})
   }
})

// CREAR TIPOS DE SEGMENTO Empresas
router.get('/crear_segmento', async function(req, res){

    try{
        req.body
       const nombre = req.query.nombre

         if(nombre == "" || nombre == "undefined"){
             
            return res.status(500).json({exitoso: false})
      }

        const qryCrear = `
            insert into tipo_segmentos(descripcion)
                values(:nombre)
         `
         const params = {nombre}

         const resultado = await sqlQuery(qryCrear, params)

        res.status(200).json({exitoso: true})

     }catch(error){
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
        select id, 
        nombre, descripcion,
        fecha_creado 
        from productos
        where id = :id 
        and fecha_eliminado is null`

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


router.get('/nombre/:nombre', async function(req, res){

    const nombre = req.params.nombre
    
    if(!nombre){
        return res.status(400).json({exitoso: false, error: 'nombre no encontrado no encontrado'})
    }

    try{
        // investigar evitar inyeccion sql en las variables `zanitizar` parametros en nodej

        const filto_nombre="'%"+ nombre + "%'"

        const qryNombre= `
        select id, nombre, descripcion,
        fecha_creado 
        from productos
        where nombre like ${filto_nombre}
        and fecha_eliminado is null`

          const params = {nombre}

          const resultados = await sqlQuery(qryNombre, params)

          if (resultados.length == 0 ){
            return res.status(400).json({exitoso: false, error: 'no encontrado'})
        }

        res.status(200).json({exitoso: true, resultados})

    } catch (error) {
         console.log(error)
        res.status(500).json({exitoso: false})
    }   
    })

router.get('/explorar/:tipoSegmento', async function(req, res){

    const tipoSegmento = req.params.tipoSegmento

    const qryProductos = `
        select 
            p.id,
            p.nombre, 
            p.modelo, 
            p.descripcion as descripcion_producto,
            p.enlace, 
            tp.descripcion as descripcion_tipo_producto,
            ts.descripcion as descripcion_segmento
        from productos p
        inner join tipo_producto tp 
                on tp.id =p.tipoProductoId
            and tp.fecha_eliminado is null
        inner join tipo_segmentos ts 
                on ts.id=p.tipoSegmentoId 
            and ts.fecha_eliminado is null
        where p.fecha_eliminado is null
        and ts.id = :tipoSegmento
    `

    try {
        const productos = await sqlQuery(qryProductos, {tipoSegmento})
        
        res.status(200).json({exitoso: true, productos})
           
    } catch (error) {
        console.log(error)
        res.status(500).json({exitoso: false})
    }

})

module.exports = router
