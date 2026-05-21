const express = require('express');
const path = require('path');
const sequelize = require('./database/database');
const tagsRouter = require('./routes/tags');

const app = express();
const port = 3888;

const cors = require('cors');
const redirectHandler = require('./redirectHandler');

// Enable CORS
app.use(cors());


// ✅ Use absolute path for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/tags', tagsRouter);

app.get('/', (req, res) => {
  res.send('Geo Tag Server is running!');
});

app.get('/test', (req, res) => {
  res.send('Geo Tag Server is testing!');
});

app.use('/redirect', redirectHandler);

sequelize.sync().then(async () => {
  try {
    await sequelize.query("ALTER TABLE `Tags` ADD COLUMN `image_extension` VARCHAR(255) DEFAULT NULL;");
  } catch (err) {
    // Ignore error if column already exists
  }
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
});
