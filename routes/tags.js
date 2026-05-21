
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { nanoid } = require('nanoid');
const Tag = require('../models/Tag');
const fs = require('fs').promises;
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const tag = nanoid();
    req.tag = tag;
    cb(null, tag + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({ storage: storage });

router.post('/upload', upload.single('image'), async (req, res) => {
  const { device_id, timestamp, latitude, longitude } = req.body;
  const tag = req.tag || nanoid();
  const extension = req.file ? req.file.filename.split('.').pop() : 'jpg';

  // Clean and parse inputs
  const cleanDeviceId = typeof device_id === 'string' ? device_id.trim() : (device_id || '');

  let cleanTimestamp = new Date();
  if (timestamp) {
    let t = typeof timestamp === 'string' ? timestamp.trim() : timestamp;
    if (typeof t === 'string' && /^\d+$/.test(t)) {
      t = parseInt(t, 10);
    }
    const parsed = new Date(t);
    if (!isNaN(parsed.getTime())) {
      cleanTimestamp = parsed;
    }
  }

  const cleanLatitude = latitude ? parseFloat(String(latitude).trim()) : 0.0;
  const cleanLongitude = longitude ? parseFloat(String(longitude).trim()) : 0.0;

  try {
    const newTag = await Tag.create({
      tag,
      device_id: cleanDeviceId,
      timestamp: cleanTimestamp,
      latitude: cleanLatitude,
      longitude: cleanLongitude,
      image_extension: extension
    });

    res.json({ tag: `${tag}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:tag', async (req, res) => {
  const { tag } = req.params;

  try {
    const foundTag = await Tag.findOne({ where: { tag } });

    if (foundTag) {
      let extension = foundTag.image_extension;

      if (!extension) {
        const uploadsDir = path.join(__dirname, '../uploads');
        extension = 'jpg';
        try {
          const files = await fs.readdir(uploadsDir);
          const matchedFile = files.find(file => file.startsWith(tag + '.'));
          if (matchedFile) {
            extension = matchedFile.split('.').pop();
            foundTag.image_extension = extension;
            await foundTag.save();
          }
        } catch (err) {
          console.error('Error reading uploads directory:', err);
        }
      }

      res.json({
        imageUrl: `/uploads/${tag}.${extension}`,
        ...foundTag.toJSON()
      });
    } else {
      res.status(404).json({ error: 'Tag not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
