import { Database } from '../models/database.model.js';

export const databaseService = {
  // Tạo database
  createDatabase: async ({ name, user, filePath }) => {
    return await Database.create({ name, user, filePath });
  },

  // Lấy tất cả database của 1 user
  getDatabasesByUser: async (userId) => {
    return await Database.find({ user: userId });
  },

  // Lấy database theo id
  getDatabaseById: async (id) => {
    return await Database.findById(id);
  },

  // Cập nhật database
  updateDatabase: async (id, { userId, name, filePath }) => {
    const database = await Database.findById(id);
    if (!database) throw { status: 404, message: 'Database không tồn tại' };
    if (database.user.toString() !== userId) throw { status: 403, message: 'Không có quyền cập nhật' };

    database.name = name || database.name;
    if (filePath) database.filePath = filePath;

    return await database.save();
  },

  // Xóa database
  deleteDatabase: async (id, userId) => {
    const database = await Database.findById(id);
    if (!database) throw { status: 404, message: 'Database không tồn tại' };
    if (database.user.toString() !== userId) throw { status: 403, message: 'Không có quyền xóa' };

    await database.deleteOne();
    return { message: 'Xóa database thành công' };
  }
};
