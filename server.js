const http = require("http");
const client = require('./db');

const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;
    let body = '';
    //Esto escucha el evento data del objeto req, los datos de body
    //llegan en pedazos por lo que los sumamos
    req.on('data', chunk => body += chunk.toString());

    req.on('end', ()=>{
        //Apartado POST para crear un nuevo contacto
        if (method === 'POST' && url ==='/contacto'){
            const data = JSON.parse(body);
            const {nombre,correo,mensaje} = data;

            if (!nombre || !correo || !mensaje){
                        res.writeHead(400);
                        return res.end(JSON.stringify({error: 'Datos incompletos'}))
                    }
                    //Aca lo insertamos en la data base
                    client.query('insert into constactos (nombre, correo, mensaje) values($1, $2, $3)',[nombre, correo, mensaje])
                    .then(() => {
                        res.writeHead(201, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify({mensaje:'Registrado con exito'}));
                    })
                    .catch(err => {
                        console.error(err);
                        res.writeHead(500, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify({error: 'Error al hacer submit'}));
                    });
        //GET para listar los contactos
        }else if(method === 'GET' && url === '/contacto'){
            client.query('select * from constactos order by id DESC')
            .then(result => {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(result.rows));
                })
                .catch(err => {
                    console.error(err);
                    res.writeHead(500, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({error: 'Error al listar'}));
                });
        //PUT Editar el contacto
        }else if(method === 'PUT' && url === '/constacto'){
            const id = url.split('/').pop();
            const {nombre, correo, mensaje}=JSON.parse(body)||{};
            if (!nombre || !correo || !mensaje){
                res.writeHead(400, {'Content-Type':'application/jason'});
                return res.end(JSON.stringify({error: 'Error al editar'}));
            }
            client.query('update contactos set nombre=$1, correo=$2, mensaje=$3 where id=$4',[nombre,correo,mensaje,id])
            .then(()=>{
                res.writeHead(200, {'Content-Type':'application/jason'});
                return res.end(JSON.stringify({error: 'Se edito correctamente'}));
            })
            .catch(err=>{
                res.writeHead(500, {'Content-Type':'application/jason'});
                return res.end(JSON.stringify({error: 'Error al editar'}));
            })
        //PATCH actuliza unicamente el mensaje
        }else if(method === 'PATCH' && url === '/contacto'){
            const id = url.split('/').pop();
            const {mensaje}=JSON.parse(body)||{};
            if (!mensaje){
                res.writeHead(400, {'Content-Type':'application/jason'});
                return res.end(JSON.stringify({error: 'Error al editar mensaje'}));
            }
            client.query('update contactos set mensaje=$1 where id=$2',[mensaje,id])
            .then(()=>{
                res.writeHead(200, {'Content-Type':'application/jason'});
                return res.end(JSON.stringify({error: 'Se edito el mensaje correctamente'}));
            })
            .catch(err=>{
                res.writeHead(500, {'Content-Type':'application/jason'});
                return res.end(JSON.stringify({error: 'Error al editar el mensaje'}));
            })
        //DELETE para eliminar :3
        }else if (method === 'DELETE' && url.startsWith('/api/contacto/')) {
            const id = url.split('/').pop();

            client.query('DELETE FROM contactos WHERE id=$1',[id])
            .then(() => {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ mensaje: 'Registro eliminado' }));
            })
            .catch(err => {
                console.error(err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Error al eliminar' }));
            });
        }else{
            res.writeHead(404, {Content-Type': 'application/json'});
            res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
        }
    })
});

server.listen(3000, () => {
    console.log("Servidor conectado en el puerto 3000");
});