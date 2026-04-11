import { app, httpServer } from './app';
import { config } from './config';

const { PORT } = config;

httpServer.listen(PORT, () => {
  console.log(`   Server running on http://localhost:${PORT}`);
  console.log(`   WebSocket ready at ws://localhost:${PORT}`);
});
