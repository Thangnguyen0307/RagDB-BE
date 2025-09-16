
export default function messageEvents(socket, io) {
    console.log("Client lắng nghe message events:", socket.id);

    socket.on("join:message-listener", () => {
        socket.join("message-listener");
        console.log(`Socket ${socket.id} joined room: message-listener`);
    });

    // User gửi câu hỏi
    socket.on("send:message", async ({ message, databaseId, sessionId }) => {
        console.log(`📥 User ${sessionId} gửi: ${message} (DB: ${databaseId})`);

        // Forward câu hỏi cho AI listener
        io.to("message-listener").emit("message:received", {
            question: message,
            databaseId: databaseId || null, // Gửi kèm databaseId nếu có
            from: sessionId,
            receivedAt: new Date()
        });
    });

    // Nhận câu trả lời từ AI
    socket.on("message:answer", ({ answer, from, question }) => {
        console.log(`🤖 AI trả lời cho ${from}: ${answer}`);

        // Gửi kết quả trả về đúng user (theo sessionId)
        io.to(from).emit("answer:message", {
            question,
            answer,
            from,
            receivedAt: new Date()
        });
    });
}
