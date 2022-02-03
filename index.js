const http = require("http");
const fs = require("fs");
const { registroVenta } = require("./db");
require("dotenv").config();

const server = http.createServer((req, res) => {
    if (req.url === "/" && req.method === "GET") {
        fs.readFile("index.html", "utf-8", (err, html) => {
            if (err) return res.end("falló al leer el archivo");
            res.end(html);
        });
    }

    if (req.url === "/api/venta" && req.method === "POST") {
        let body = "";

        req.on("data", (response) => {
            body += response;
        });

        req.on("end", async () => {
            const { usuarioName, productoNombre, cantidad } = JSON.parse(body);

            const data = await registroVenta(
                usuarioName,
                productoNombre,
                cantidad
            );

            res.writeHead(data.ok ? 200 : 400, {
                "Content-Type": "application/json",
            });
            res.end(JSON.stringify(data.msg));
        });
    }
});

const puerto = process.env.PORT || 3000;

server.listen(puerto, () => console.log("andando 😍 " + puerto));
