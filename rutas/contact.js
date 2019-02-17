const express = require('express')
const router = express.Router()
const {sendMail} = require('../config/general')
const emailTemplate = require('../config/emailContactTemplate')


router.post('/send-email', (req, res)=>{

    const name = req.body.name || ''
    const email = req.body.email || ''
    const phone = req.body.phone || ''
    const company = req.body.company || ''
    const message = req.body.message || ''

    try {
        const data = {
            name, email,
            phone,company,
            message
        }
    
        sendMail({
            to: 'bmjosseline171@gmail.com',
            subject: 'mensaje de contacto',
            html: emailTemplate(data)
        })

        res.status(200).json({exitoso: true})

    } catch (error) {
        console.log(erro)
        res.status(500).json({exitoso: false})
    }
})

module.exports = router