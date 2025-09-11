import fs from "fs";
import path from "path";

export default function fileEvents(socket, io) {
    console.log("Client lắng nghe file events:", socket.id);

    // client có thể join room riêng
    socket.on("join:file-listener", () => {
        console.log(`${socket.id} joined room: file-listener`);
        socket.join("file-listener");
    });


    socket.on("file:ack", async ({ file, userId }) => {
        console.log(`📌 User ${userId} đã nhận file: ${file}`);

        try {
            // Nếu file đã là dạng "public/images/xxx.png"
            // => cần join với __dirname hoặc project root
            const filePath = path.join(process.cwd(), file); // process.cwd() = thư mục gốc dự án

            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error("❌ Không xóa được file:", err.message);
                } else {
                    console.log(`🗑️ File đã bị xóa: ${filePath}`);
                    io.to("file-listener").emit("file:deleted", { file, userId });
                }
            });
        } catch (err) {
            console.error("❌ Error khi xóa file:", err);
        }
    });
}
