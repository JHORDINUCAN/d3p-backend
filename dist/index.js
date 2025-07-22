"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
// Rutas
const productos_routes_1 = __importDefault(require("./routes/productos.routes"));
const notificaciones_routes_1 = __importDefault(require("./routes/notificaciones.routes"));
const contactos_routes_1 = __importDefault(require("./routes/contactos.routes"));
const carrito_routes_1 = __importDefault(require("./routes/carrito.routes"));
const pedidos_routes_1 = __importDefault(require("./routes/pedidos.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const metodos_pago_routes_1 = __importDefault(require("./routes/metodos_pago.routes"));
const categoria_routes_1 = __importDefault(require("./routes/categoria.routes"));
const stripe_routes_1 = __importDefault(require("./routes/stripe.routes"));
const whatsapp_routes_1 = __importDefault(require("./routes/whatsapp.routes"));
const location_routes_1 = __importDefault(require("./routes/location.routes"));
const weather_routes_1 = __importDefault(require("./routes/weather.routes"));
const exchange_routes_1 = __importDefault(require("./routes/exchange.routes"));
const recaptcha_routes_1 = __importDefault(require("./routes/recaptcha.routes"));
(0, dotenv_1.config)(); // Cargar variables de entorno
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Rutas API
app.use('/api/productos', productos_routes_1.default);
app.use('/api/notificaciones', notificaciones_routes_1.default);
app.use('/api/contactos', contactos_routes_1.default);
app.use('/api/carrito', carrito_routes_1.default);
app.use('/api/pedidos', pedidos_routes_1.default);
app.use('/api/auth', auth_routes_1.default);
app.use('/api/metodos-pago', metodos_pago_routes_1.default);
app.use('/api/categorias', categoria_routes_1.default);
app.use('/api/stripe', stripe_routes_1.default);
app.use('/api/whatsapp', whatsapp_routes_1.default);
app.use('/api/ubicacion', location_routes_1.default);
app.use('/api/weather', weather_routes_1.default);
app.use("/api", exchange_routes_1.default);
app.use("/api", recaptcha_routes_1.default);
// Ruta raíz
app.get('/', (req, res) => {
    res.send('API de Productos funcionando 🚀');
});
// Ruta para mantener despierta la app (ideal para usar con UptimeRobot)
app.get('/api/ping', (req, res) => {
    res.status(200).send('pong 🏓');
});
// Escuchar en 0.0.0.0 para Render
app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`✅ Servidor corriendo en http://0.0.0.0:${PORT}`);
});
