import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a profile name'],
    trim: true,
  },
  description: String,
  mapImage: String,
  devices: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device',
  }],
  config: {
    layout: {
      type: String,
      enum: ['hierarchical', 'circular', 'grid'],
      default: 'hierarchical',
    },
    autoArrange: {
      type: Boolean,
      default: true,
    },
    showLabels: {
      type: Boolean,
      default: true,
    },
    theme: {
      type: String,
      enum: ['system', 'light', 'dark'],
      default: 'system',
    },
  },
}, {
  timestamps: true,
});

export default mongoose.models.Profile || mongoose.model('Profile', profileSchema);