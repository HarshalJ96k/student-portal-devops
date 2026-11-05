
const express = require('express');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Health check API
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Student Portal is running successfully!',
        application: 'Student Portal',
        version: '1.0.0'
    });
});

// Start server
if (require.main === module) {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Student Portal running on port ${PORT}`);
    });
}

module.exports = app;
