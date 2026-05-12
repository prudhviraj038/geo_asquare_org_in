
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { nanoid } = require('nanoid');
const Tag = require('../models/Tag');

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
  const { tag } = req;

  try {
    const newTag = await Tag.create({
      tag,
      device_id,
      timestamp,
      latitude,
      longitude
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
      res.json({
        imageUrl: `/uploads/${tag}.jpg`,
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
