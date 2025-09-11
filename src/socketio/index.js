import { Server } from "socket.io";
import fileEvents from "./events/file.event.js";

let io;

export function initSocket(server) {
    io = new Server(server, {
        cors: { origin: "*" },
    });

    io.on("connection", (socket) => {
        console.log(`✅ Socket connected: ${socket.id}`);

        // đăng ký events theo domain
        fileEvents(socket, io);

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
