const express = require('express')
const router = express.Router()
const {valorValido, sqlQuery, encrypt} = require('../config/general')



router.get('/', async function(req, res){


try {
    const qryCrearUsuario=
    `select 
    u.id,
    -- concat(u.nombre, ' ', u.apellido) as nombre_completo,
    u.nombre,
    -- u.apellido,
    tu.descripcion,
    u.email,
    u.telefono,
    u.sexo
    from usuarios u
    inner join tipo_usuarios tu
    on tu.id= u.tipoUsuarioId
    and tu.fecha_eliminado is null
    where u.fecha_eliminado is null`


const resultados = await sqlQuery(qryCrearUsuario)
    
res.status(200).json({exitoso: true, resultados})

} catch (error) {
 console.log(error)
res.status(500).json({exitoso: false})
}

})

router.post('/editar', async function(req, res){

    const id = req.body.id
    const nombre = req.body.nombre
    const telefono = req.body.telefono
    const email = req.body.email
    const sexo = req.body.sexo
    const password = req.body.password
    // const direccion = req.body.direccion
    // const ciudad = req.body.ciudad
    // const imagen = req.body.image
    const tipoUsuarioId = 1; //Tipo usuario admin por defectos

    if(!valorValido(id)){
        return res.status(400).json({exitoso: false, error: 'id no valido'})
    }

    let passQry = ''
    let passEncripted = ''

    if(valorValido(password)) {
        passQry = `password = :passEncripted,`
        passEncripted = encrypt(password)
    }
    
    try {
        const qryEditar=
        `Update usuarios Set 
            nombre = :nombre, 
            telefono = :telefono,
            email = :email,
            ${passQry}
            sexo = :sexo,
            tipoUsuarioId = :tipoUsuarioId
         Where id= :id`

    const params={id, nombre, telefono, email, sexo, tipoUsuarioId, passEncripted}

    const resultados = await sqlQuery(qryEditar, params)
        
    res.status(200).json({exitoso: true})

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
        `update usuarios
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

router.post('/login', async function(req, res){

    const email = req.body.email
    const password = req.body.password
    
    // buscar usuario en la base de datos
    try {
        const qryLogin= `
          select
            id,
            email,
            nombre,
            password,
            tipoUsuarioId
          from usuarios
          where email = :email
            and fecha_eliminado is null`

        const params = {email}

        const resultados = await sqlQuery(qryLogin, params)

        // verificar que resultado no este vacio
        if (resultados.length == 0){
            return res.status(400).json({exitoso: false, error: 'credenciales no validas'})
        }

        const usuario = resultados[0]
        //cifrar contraseña con la que se esta intentando loguear
        const pass = encrypt(password)

        // comparar contraseñas cifradas
        if(usuario.password != pass)
            return res.status(400).json({exitoso: false, error: 'credenciales no validas'})

        const qryPermisos = `
            select permisoId 
            from usuario_permisos
            where usuarioId = :usuarioId
              and fecha_eliminado is null`

        const permisos = await sqlQuery(qryPermisos, {usuarioId: usuario.id})

        const data = {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            tipoUsuarioId: usuario.tipoUsuarioId,
            permisos 
        }

        res.status(200).json({exitoso: true, data})

    } catch (error) {
        console.log(error)
        res.status(500).json({exitoso: false})
    }
}) 

router.get('/tipo-usuarios', async function(req, res){
    try {
        const querytipo_usuarios =
        'select id , descripcion from tipo_usuarios'

        const tipo_usuarios = await sqlQuery(querytipo_usuarios)

        res.status(200).json({exitoso: true, tipo_usuarios})

    } catch (error) {
        console.log(error)
        res.status(500).json({exitoso: false})
   }
})

router.post('/crear_usuario', async function(req, res){

    const nombre = req.body.nombre
    const telefono = req.body.telefono
    const email = req.body.email
    const sexo = req.body.sexo
    const password = req.body.password
    // const direccion = req.body.direccion
    // const ciudad = req.body.ciudad
    // const imagen = req.body.image
    const tipoUsuarioId = 1; //Tipo usuario admin por defectos

    
    if(!nombre || !telefono || !email || !password || !tipoUsuarioId ){
        return res.status(400).json({exitoso: false, error: 'campos incompletos'})
    }

    // validar datos

    try {
        //cifrar contraseña
        const passEncripted = encrypt(password)
        //insertar datos
        const qryCrearUsuario = `
            insert into usuarios (nombre, telefono, email, sexo, password, tipoUsuarioId)
                values(:nombre, :telefono, :email, :sexo, :passEncripted, :tipoUsuarioId)`

        const params = {nombre, telefono, email, sexo, tipoUsuarioId, passEncripted}

        const result = await sqlQuery(qryCrearUsuario, params)

        res.status(200).json({exitoso: true})

    } catch (error) {
        console.log(error)
        res.status(500).json({exitoso: false})
    }
    

})                                                                  


module.exports = router