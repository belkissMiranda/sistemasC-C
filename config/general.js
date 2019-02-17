const conexionDB= require ('./conexionBD')
const crypto = require('crypto')
const transporter = require('./emailTransporter')

const salt = 'sistemas_C&C'

const sqlQuery = (_query = '', _params = null)=>{

    return new Promise((resolve, reject)=>{
      
        conexionDB.query({
        namedPlaceholders: true,
        sql: _query
      }, _params)
  
      .then(rows=>{
        resolve(rows)
      })
      .catch(err=>{
        reject(err)
      })
    })
  }

const encrypt = (text)=>{
  const hash = crypto.createHmac('sha256', salt)
                    .update(text)
                    .digest('hex')

  return hash
}

const valorValido = (valor)=>{
  
  if(valor == null || valor == 'undefined' || valor == "")
    return false

  return true
}

/**
   * @typedef {Object} MailOptions
   * @property {string} to email address to send email
   * @property {String} subject email subject
   * @property {String} html email body in html format 
   * @param {MailOptions} mailOptions body of email options
   */
function sendMail(mailOptions){

  const to = mailOptions.to? mailOptions.to : ''
  const subject = mailOptions.subject ? mailOptions.subject : ''
  const html = mailOptions.html ? mailOptions.html : ''

  const mailOpts = {
    from: 'devtesting160@gmail.com',
    to,
    subject, 
    html
  }

  transporter.sendMail(mailOpts, (err)=>{
    if (err){
      console.log(err)
    }
  })
}


module.exports={
  sqlQuery,
  encrypt,
  valorValido,
  sendMail
}