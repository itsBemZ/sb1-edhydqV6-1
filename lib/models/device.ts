import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a device name'],
    trim: true,
  },
  type: {
    type: String,
    required: [true, 'Please provide a device type'],
    enum: ['WAP', 'Server', 'Laptop', 'DPO'],
  },
  status: {
    type: String,
    required: [true, 'Please provide a device status'],
    enum: ['Online', 'Offline'],
  },
  ip: {
    type: String,
    required: [true, 'Please provide an IP address'],
    match: [/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/, 'Please provide a valid IP address'],
  },
  mac: {
    type: String,
    match: [/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, 'Please provide a valid MAC address'],
  },
  location: String,
  lastSeen: {
    type: Date,
    default: Date.now,
  },
  profiles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
  }],
  positions: {
    type: Map,
    of: {
      x: Number,
      y: Number,
    },
  },
  connections: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device',
  }],
}, {
  timestamps: true,
});

export default mongoose.models.Device || mongoose.model('Device', deviceSchema);