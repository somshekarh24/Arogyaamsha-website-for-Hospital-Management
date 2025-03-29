const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/arogyaamshaDB')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

// User Schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: String,
});

const User = mongoose.model('User', userSchema);

// Root Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Create Account Route (GET)
app.get('/create-account', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'create_account.html'));
});



app.post('/login', async (req, res) => {
    const { username, password, role } = req.body;

    try {
        const user = await User.findOne({ username, role });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send("Invalid username, password, or role.");
        }

        // Redirect based on role
        if (role === "doctor") {
            res.redirect('/doctor-dashboard');
        } else if (role === "patient") {
            res.redirect('/patient-dashboard');
        } else if (role === "blood_officer") {
            res.redirect('/blood-officer-dashboard');
        } else {
            res.status(401).send("Invalid role.");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error.");
    }
});


// Create Account Route (POST)
app.post('/create-account', async (req, res) => {
    const { username, password, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword, role });
        await newUser.save();

        // Send success message with a link to the login page
        res.send('Account created successfully. <a href="/">Click here to login.</a>');
    } catch (err) {
        res.status(500).send('Error creating account.');
    }
});

app.post('/chatbot', (req, res) => {
    const { message } = req.body;

    // Add more complex logic or integrate AI here
    let response = "I'm here to help!";
    if (message.includes('appointment')) {
        response = 'You can book an appointment in the "Appointments" section.';
    } else if (message.includes('blood stock')) {
        response = 'Check the blood stock availability in the "Blood Stock" section.';
    }

    res.json({ response });
});




// Dashboard Routes (Placeholders)
app.get('/doctor-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'doctor_dashboard.html'));
});

app.get('/patient-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'patient_dashboard.html'));
});

app.get('/blood-officer-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'blood_officer_dashboard.html'));
});

// Server Start
app.listen(3001, () => console.log('Server running on http://localhost:3001'));