
export default function messageEvents(socket, io) {
    console.log("Client lắng nghe message events:", socket.id);

    // client có thể join room riêng
    socket.on("joinMessageRoom", () => {
        socket.join("message");
        console.log(`Socket ${socket.id} joined room: message`);
    });

    socket.on("send:message", ({ message, sessionId }) => {
        console.log(`Nhận message từ client (Socket Session ID) ${socket.id}: ${message}`);

        // Gửi lại cho tất cả client trong room
        io.to("message").emit("receive:message", {
            socketId: socket.id,     
            message,
            sessionId,
            receivedAt: new Date()
        });
    });
}

