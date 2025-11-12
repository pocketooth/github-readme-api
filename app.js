const express = require('express');
const app = express();
const authMiddleware = require('./middleware/auth');
const loginRouter = require('./routes/login');
const readmeRouter = require('./routes/readme');

// Middleware to parse JSON request bodies
app.use(express.json());

// Mount login route. Public endpoint
app.use('/', loginRouter);

// Protected route to fetch README. All routes under /readme require auth
app.use('/readme', authMiddleware, readmeRouter);

// Root route for health check or simple message
app.get('/', (req, res) => {
  res.send('GitHub README API is running. Use /login to authenticate and /readme to fetch README content.');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});