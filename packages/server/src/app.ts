import express from 'express';
import cors from 'cors';
import path from 'path';

import userRoutes from './modules/user/user.routes';
import authRoutes from './modules/auth/auth.routes';
//import gameRoutes from './modules/game/game.routes';
import { errorHandler } from './middleware/error.middleware';

import { createServer } from 'http';
import { Server } from 'socket.io';
import { config } from './config';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/user', userRoutes);
app.use('/auth', authRoutes);
//app.use('/game', gameRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/favicon.ico', (_req, res) => {
  res.status(204).send();
});

app.use(errorHandler);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('join_game', (gameId: string) => {
    socket.join(`game:${gameId}`);
    console.log(`Client ${socket.id} joined game:${gameId}`);
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

export { app, httpServer, io };
