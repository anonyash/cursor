const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.')); // Serve static files from current directory

// In-memory user storage (replace with database in production)
const users = [
    {
        username: 'admin',
        // This is a hashed version of 'password'
        password: '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqDu0.i9ZwPT6'
    }
];

// Login endpoint
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user
        const user = users.find(u => u.username === username);
        
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }

        // Compare password
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }

        // Login successful
        res.json({ 
            success: true, 
            message: 'Login successful',
            username: user.username
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Signup endpoint
app.post('/api/signup', async (req, res) => {
    const { username, password, email, fullname } = req.body;

    try {
        // Check if username already exists
        if (users.some(u => u.username === username)) {
            return res.status(400).json({ success: false, message: 'Username already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Add new user
        users.push({
            username,
            password: hashedPassword,
            email,
            fullname
        });

        res.json({ success: true, message: 'Account created successfully' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 