const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/db');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const fieldRoutes = require('./routes/fieldRoutes');
const studentRoutes = require('./routes/studentRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());


const corsOptions = {
  origin: ['https://university-dashboard-pi.vercel.app/'], 
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use('/api/auth', authRoutes);
app.use('/api/fields', fieldRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/subjects', subjectRoutes);


const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});


module.exports = app;
