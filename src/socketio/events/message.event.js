export default function messageEvents(socket, io) {
    console.log("Client lắng nghe message events:", socket.id);

    // AI join room để lắng nghe tất cả message
    socket.on("join:ai-listener", () => {
        socket.join("ai-listener");
        console.log(`🤖 AI socket ${socket.id} joined room: ai-listener`);
    });

    // User join vào room theo combo userId + databaseId
    socket.on("join:room", ({ userId, databaseId }) => {
        const room = `room-${userId}-${databaseId}`;
        socket.join(room);
        console.log(`Socket ${socket.id} joined ${room}`);
    });

    // User gửi câu hỏi
    socket.on("send:message", async ({ message, databaseId, userId }) => {
        console.log(`📥 User ${userId} gửi: ${message} (DB: ${databaseId})`);

        // Forward câu hỏi cho AI listener
        io.to("ai-listener").emit("message:received", {
            question: message,
            databaseId,
            userId,
            receivedAt: new Date()
        });
    });

    // Nhận câu trả lời từ AI
    socket.on("message:answer", ({ answer, question, userId, databaseId }) => {
        console.log(`🤖 AI trả lời cho User ${userId} (DB ${databaseId}): ${answer}`);

        const room = `room-${userId}-${databaseId}`;
        io.to(room).emit("answer:message", {
            question,
            answer,
            userId,
            databaseId,
            receivedAt: new Date()
        });
    });
}
