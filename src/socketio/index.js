import { Server } from "socket.io";
import fileEvents from "./events/file.event.js";
import messageEvents from "./events/message.event.js";

let io;

export function initSocket(server) {
    // ------------------------------Cấu hình Socket.IO server
    io = new Server(server, {
        cors: {
            origin: "*", 
            methods: ["GET", "POST"],
            credentials: true
        },
        path: "/projects/ragdb/socket.io"
    });

    //  ----------------------------Cấu hình Socket.IO Localhost (không có path)
    // io = new Server(server, {
    //     cors: {
    //         origin: "*",         
    //         methods: ["GET", "POST"],
    //         credentials: true
    //     },
    // });

    io.on("connection", (socket) => {
        console.log(`✅ Socket connected: ${socket.id}`);

        // đăng ký events theo domain
        fileEvents(socket, io);
        messageEvents(socket, io);

        socket.on("disconnect", () => {
            console.log(`❌ Socket disconnected: ${socket.id}`);
        });
    });

    return io;
}

export function getIO() {
    if (!io) throw new Error("Socket.IO chưa được init");
    return io;
}
