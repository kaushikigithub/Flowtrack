require('dotenv').config();
const app = require('./src/app');
const pool = require('./src/config/db');
require('./src/jobs/reminderJob'); // starts the cron schedule

const PORT = process.env.PORT || 5000;

pool.query('SELECT NOW()')
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to database:', err.message);
    process.exit(1);
  });