
export default function messageEvents(socket, io) {
    console.log("Client lắng nghe message events:", socket.id);

    socket.on("join:message-listener", () => {
        socket.join("message");
        console.log(`Socket ${socket.id} joined room: message`);
    });

    socket.on("send:message", async ({ message, sessionId }) => {
        console.log(`📥 Nhận message từ ${sessionId}: ${message}`);

        // 🔹 Xử lý câu hỏi (ở đây giả lập AI)
        const answer = await fakeAIService(message);

        // 🔹 Trả kết quả đúng về sessionId của FE
        // io.to(sessionId).emit("answer:message", {
        //     question: message,
        //     answer,
        //     from: sessionId,
        //     receivedAt: new Date()
        // });

        // Hoặc gửi đến tất cả ai đang lắng nghe trong room "message"
        io.to("message").emit("answer:message", {
            question: message,
            answer,
            from: sessionId,
            receivedAt: new Date()
        });
    });
}

// Giả lập AI service xử lý
async function fakeAIService(question) {
    return `Đây là câu trả lời cho: "${question}"`;
}

