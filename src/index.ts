import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';

// Rutas
import productosRouter from './routes/productos.routes';
import notificacionesRouter from './routes/notificaciones.routes';
import contactosRouter from './routes/contactos.routes';
import carritoRouter from './routes/carrito.routes';
import pedidosRouter from './routes/pedidos.routes';
import authRouter from './routes/auth.routes';
import metodosPagoRouter from './routes/metodos_pago.routes';
import categoriaRoutes from './routes/categoria.routes';
import stripeRoutes from './routes/stripe.routes';
import whatsappRoutes from './routes/whatsapp.routes';
import locationRoutes from './routes/location.routes';
import weatherRoutes from './routes/weather.routes';
import exchangeRoutes from "./routes/exchange.routes";
import recaptchaRouter from "./routes/recaptcha.routes";

config(); // Cargar variables de entorno

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Rutas API
app.use('/api/productos', productosRouter);
app.use('/api/notificaciones', notificacionesRouter); 
app.use('/api/contactos', contactosRouter);
app.use('/api/carrito', carritoRouter);
app.use('/api/pedidos', pedidosRouter);
app.use('/api/auth', authRouter);
app.use('/api/metodos-pago', metodosPagoRouter);
app.use('/api/categorias', categoriaRoutes); 
app.use('/api/stripe', stripeRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/ubicacion', locationRoutes);
app.use('/api/weather', weatherRoutes);
app.use("/api", exchangeRoutes);
app.use("/api", recaptchaRouter);

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