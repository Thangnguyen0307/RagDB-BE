import mongoose from 'mongoose';

const databaseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export const Database = mongoose.model('Database', databaseSchema);
