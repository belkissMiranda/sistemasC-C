module.exports = (data = {
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
    })=>{

    return `
    <style>
      
      body{
        font-family: Arial, Helvetica, sans-serif;
        padding-left: .5em;
      }
  
      h3{
        color: #626262;
      }
  
      table {
        width: 100%;
        display: table;
        border-collapse: collapse;
        border-spacing: 0;
      }
  
      td, th {
        padding: 15px 5px;
        display: table-cell;
        text-align: left;
        vertical-align: middle;
        border-radius: 2px;
      }
  
      tr {
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
      }
      
      #notice{
        padding-top: 1.5em;
        padding-left: 0.5em;
        padding-bottom: 1.5em;
        background-color: #f7f7f3;
      }
    
    </style>
  <body>
    <div>
      <h3>Buen día </h3>
    
      <p><b>Sistemas C&C Honduras</b> le informa que hemos recibido información de contacto del cliente: 
      <br>
      <br>
      Nombre: ${data.name}<br>
      Correo: <a href="mailto:${data.email}">${data.email}</a> <br>
      Teléfono: ${data.phone}<br>
      Empresa: ${data.company}<br>

      <br>
      Quien ha dejado el siguiente mensaje:</p>

      <p><i>${data.message}</i></p>
    </div>
  </body>`
}