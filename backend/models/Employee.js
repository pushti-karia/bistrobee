import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  date: Date,
  checkIn: Date,
  checkOut: Date,
  status: { type: String, enum: ['present', 'absent', 'half-day', 'leave'] }
});

const employeeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  employeeId: { type: String, required: true, unique: true },
  designation: String,
  salary: Number,
  joiningDate: { type: Date, default: Date.now },
  shift: { type: String, enum: ['morning', 'afternoon', 'night', 'flexible'] },
  attendance: [attendanceSchema],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Employee', employeeSchema);
