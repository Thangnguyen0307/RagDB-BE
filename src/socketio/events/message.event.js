
export default function messageEvents(socket, io) {
    console.log("Client lắng nghe message events:", socket.id);

    socket.on("join:message-listener", () => {
        socket.join("message-listener");
        console.log(`Socket ${socket.id} joined room: message-listener`);
    });

    socket.on("send:message", async ({ message, sessionId }) => {
        console.log(`📥 Nhận message từ ${sessionId}: ${message}`);

        // 🔹 Xử lý câu hỏi (ở đây giả lập AI)
        const answer = await fakeAIService(message);

        // 🔹 Trả kết quả đúng về sessionId của FE
        io.to(sessionId).emit("answer:message", {
            question: message,
            answer,
            from: sessionId,
            receivedAt: new Date()
        });

        // Gửi thông báo cho tất cả listener trong room "messag"
        io.to("message-listener").emit("message:received", {
            question: message,
            answer,
            from: sessionId,
            receivedAt: new Date()
        });
    });

    // Listener có thể gửi ack ngược lại
    socket.on("message:ack", ({ from, question }) => {
        console.log(`Listener đã nhận câu hỏi "${question}" từ ${from}`);
    });
}

// Giả lập AI service xử lý
async function fakeAIService(question) {
    return `Đây là câu trả lời cho: "${question}"`;
}

