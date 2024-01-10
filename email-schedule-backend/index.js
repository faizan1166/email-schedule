const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// require("dotenv").config()
require('./db/dbconnection');
const app = express();
app.use(cors());

const scheduleSchema = new mongoose.Schema({
  title: String,
  description: String,
  subject: String,
  frequency: String,
  repeat: String,
  time: String,
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

app.use(express.json());


app.get('/schedules', async (req, res) => {
  try {
    const searchQuery = req.query.search ? { title: new RegExp(req.query.search, 'i') } : {};
    const schedules = await Schedule.find(searchQuery);
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/schedules/:id', async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/schedules/:id', async (req, res) => {
  try {
    const updatedSchedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedSchedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/schedules/:id', async (req, res) => {
  try {
    await Schedule.findByIdAndDelete(req.params.id);
    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/schedules', async (req, res) => {
  try {
    const newSchedule = await Schedule.create(req.body);
    res.json(newSchedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.listen(5000, () => {
  console.log(`Server is running on port 5000`);
});
