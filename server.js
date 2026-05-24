global.crypto = require('crypto');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const SECRET_KEY = "my_super_secret_key";

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

mongoose.connect('mongodb://mongo:27017/eventDB');

const User = mongoose.model('User', { username: String, password: String });
// ADDED: createdBy field
const Event = mongoose.model('Event', { title: String, date: String, venue: String, createdBy: String });
const Registration = mongoose.model('Registration', { studentName: String, eventId: String });

const auth = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send("No Token");
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).send("Invalid Token");
        req.user = user; // user.username is now available
        next();
    });
};

app.post('/register-user', async (req, res) => {
    const user = new User(req.body);
    await user.save();
    res.json({ message: "Success" });
});

app.post('/login', async (req, res) => {
    const user = await User.findOne(req.body);
    if (user) {
        // We include the username in the token
        const token = jwt.sign({ username: user.username }, SECRET_KEY);
        res.json({ token, username: user.username });
    } else {
        res.status(400).json({ error: "Fail" });
    }
});

app.get('/events', async (req, res) => res.json(await Event.find()));

app.post('/events', auth, async (req, res) => {
    // Save the event with the username of the person logged in
    const e = new Event({ ...req.body, createdBy: req.user.username });
    await e.save();
    res.json(e);
});

// UPDATED: Delete route with ownership check
app.delete('/events/:id', auth, async (req, res) => {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).send("Event not found");

    // Check if the person deleting is the same person who created it
    if (event.createdBy !== req.user.username) {
        return res.status(403).send("Only the creator can delete this event!");
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

app.post('/join', async (req, res) => {
    const r = new Registration(req.body);
    await r.save();
    res.json(r);
});

app.get('/registrations', async (req, res) => {

    try {

        const registrations = await Registration.find();

        const result = [];

        for (let r of registrations) {

            const event = await Event.findById(r.eventId);

            result.push({
                studentName: r.studentName,
                eventId: r.eventId,
                eventTitle: event ? event.title : "Event Deleted"
            });
        }

        res.json(result);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
});

app.listen(3000, () => console.log('Server Running...'));