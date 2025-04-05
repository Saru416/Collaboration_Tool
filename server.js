import {createServer} from 'http';
import {Server} from 'socket.io';

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ["GET","POST"]
    }
});

io.on('connection',(socket) => {
    console.log("Client connected:", socket.id);

    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} join room ${roomId}`);
    });

    socket.on('send-message', ({ roomId, message }) => {
        io.to(roomId).emit('receive-message', { message, from: socket.id });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

httpServer.listen(3001, () => {
    console.log('🚀 Socket.IO server running on http://localhost:3001');
});