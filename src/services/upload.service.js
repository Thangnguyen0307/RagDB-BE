
export const uploadService = {

    single(file) {
        if (!file) {
            throw new Error("Không có file để upload");
        }

        return {
            url: `/images/${file.filename}`,    
            filename: file.filename,
            mimetype: file.mimetype,
            size: file.size,
        };
    },

    multiple(files) {
        if (!files || files.length === 0) {
            throw new Error("Không có file để upload");
        };

        return files.map(file => ({
            url: `/images/${file.filename}`,    
            filename: file.filename,
            mimetype: file.mimetype,
            size: file.size,
        }));
    }
};

export default uploadService;

// Sử dụng trong controller
// import uploadService from '../services/upload.service.js';
// app.post('/upload-single', upload.single('image'), (req, res) => {
