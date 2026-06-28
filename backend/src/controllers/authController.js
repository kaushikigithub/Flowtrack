const authService = require('../services/authService');

async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;
    const newUser = await authService.registerUser({ name, email, password, role });

    res.status(201).json({
      message: 'User registered successfully',
      user: newUser,
    });
  } catch (err) {
    next(err); // passes the error to our centralized error handler
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser({ email, password });

    res.status(200).json({
      message: 'Login successful',
      ...result, // spreads { token, user } into the response
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };