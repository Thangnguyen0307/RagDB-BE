import { Database } from '../models/database.model.js';

export const databaseService = {
  createDatabase: async (name, userId) => {
    return await Database.create({ name, user: userId });
  },

  getDatabasesByUser: async (userId) => {
    return await Database.find({ user: userId });
  },

  getDatabaseById: async (id) => {
    return await Database.findById(id);
  },

  updateDatabase: async (id, userId, name) => {
    const database = await Database.findById(id);
    if (!database) throw { status: 404, message: 'Database không tồn tại' };
    if (database.user.toString() !== userId) {
      throw { status: 403, message: 'Không có quyền cập nhật' };
    }
    database.name = name || database.name;
    return await database.save();
  },

  deleteDatabase: async (id, userId) => {
    const database = await Database.findById(id);
    if (!database) throw { status: 404, message: 'Database không tồn tại' };
    if (database.user.toString() !== userId) {
      throw { status: 403, message: 'Không có quyền xóa' };
    }
    await database.deleteOne();
    return { message: 'Xóa database thành công' };
  }
};
