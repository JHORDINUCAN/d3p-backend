import express from 'express';
import cors from 'cors';
import productosRouter from './routes/productos.routes';
import notificacionesRouter from './routes/notificaciones.routes';
import contactosRouter from './routes/contactos.routes';
import carritoRouter from './routes/carrito.routes';
import pedidosRouter from './routes/pedidos.routes';
import authRouter from './routes/auth.routes';
import metodosPagoRouter from './routes/metodos_pago.routes';
import { config } from 'dotenv';
import categoriaRoutes from "./routes/categoria.routes";

config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/productos', productosRouter);
app.use('/api/notificaciones', notificacionesRouter); 
app.use('/api/contactos', contactosRouter);
app.use('/api/carrito', carritoRouter);
app.use('/api/pedidos', pedidosRouter);
app.use('/api/auth', authRouter);
app.use('/api/metodos-pago', metodosPagoRouter);
app.use('/api/categorias', categoriaRoutes); 


app.get('/', (req, res) => {
  res.send('API de Productos funcionando');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});