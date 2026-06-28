const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

const SALT_ROUNDS = 10;

// Handles the full registration flow
async function registerUser({ name, email, password, role }) {
  // 1. Check if a user with this email already exists
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    const error = new Error('Email is already registered');
    error.statusCode = 409; // 409 = Conflict
    throw error;
  }

  // 2. Hash the password before storing it
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // 3. Save the new user (default role to 'member' if not provided)
  const newUser = await userRepository.createUser({
    name,
    email,
    passwordHash,
    role: role || 'member',
  });

  return newUser;
}

// Handles the full login flow
async function loginUser({ email, password }) {
  // 1. Find the user by email
  const user = await userRepository.findByEmail(email);
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401; // 401 = Unauthorized
    throw error;
  }

  // 2. Compare the provided password against the stored hash
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // 3. Generate a JWT token containing the user's id and role
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  // 4. Return the token + basic user info (never the password hash!)
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

module.exports = { registerUser, loginUser };