const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    user: process.env.USER,
    host: "localhost",
    password: process.env.PASSWORD,
    database: process.env.DBNAME,
    port: process.env.PORTDB,
});

const registroVenta = async (usuarioName, productoNombre, cantidad) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN;");

        const { id: idUsuario } = (
            await client.query(
                `SELECT * FROM usuarios WHERE nombre = '${usuarioName}'`
            )
        ).rows[0];

        const { id: idProducto, precio } = (
            await client.query(
                `SELECT * FROM productos WHERE nombre = '${productoNombre}';`
            )
        ).rows[0];

        await client.query(`UPDATE productos
        SET stock = stock - ${cantidad}
        WHERE id = ${idProducto};`);

        await client.query(`UPDATE usuarios
        SET saldo = saldo - (${cantidad} * ${precio})
        WHERE id = ${idUsuario};`);

        await client.query("COMMIT;");
        console.log("Transacción exitosa");
        return {
            ok: true,
            msg: "Transacción exitosa",
        };
    } catch (error) {
        await client.query("ROLLBACK;");
        console.log(error);
        console.log("Transacción fallida");
        return {
            ok: false,
            msg: "Transacción fallida",
        };
    } finally {
        client.release();
        console.log("Libre soy");
    }
};

module.exports = { registroVenta };
