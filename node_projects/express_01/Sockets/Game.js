const { Server } = require('socket.io');

function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*", // Adjust this in production to restrict origins
      methods: ["GET", "POST"]
    }
  });

  // WebSocket Setup for Real-Time Game Connections
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    
    // Join Room
    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
      io.to(roomId).emit('playerJoined', `Player ${socket.id} joined the game.`);
    });
  
    // Handle Move Event
    socket.on('move', ({ roomId, moveData }) => {
      console.log(`Move received for room ${roomId}:`, moveData);
      socket.to(roomId).emit('move', moveData); // Broadcast the move to other players in the room
    });
  
    // Handle Disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      io.emit('playerLeft', `Player ${socket.id} left the game.`);
    });
  });

  return io;
}

module.exports = setupSocket;