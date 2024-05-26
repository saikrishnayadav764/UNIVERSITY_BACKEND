const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Student = require('../models/Student');

const adminUsername = 'admin';
const adminPassword = 'admin123';

exports.loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  if (username === adminUsername && password === adminPassword) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token,  role: 'admin'});
  }

  return res.status(401).json({ message: 'Invalid credentials' });
};

exports.loginStudent = async (req, res) => {
  const { username, password } = req.body;

  const student = await Student.findOne({ where: { username } });

  if (student && bcrypt.compareSync(password, student.password)) {
    const tokenPayload = {
      id: student.id,
      username: student.username,
      enrollmentYear: student.enrollmentYear,
      role: 'student'
    };
    const token = jwt.sign({ tokenPayload, role: 'student' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token,...req.user, role: 'student' });
  }

  return res.status(401).json({ message: 'Invalid credentials' });
};

exports.signupStudent = async (req, res) => {
  const { username, password, enrollmentYear, fieldId } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 10);

  const student = await Student.create({ username, password: hashedPassword, enrollmentYear, fieldId });

  return res.status(201).json(student);
};
exports.logout = async (req, res) => {
  res.json({ message: 'Logout successful' });
};

exports.currentUser = async (req, res) => {
  // Extracting user details from the request (assuming you're using middleware to decode the token)
  const currentUser = req.user;
  console.log(currentUser)

  // Returning user details
  res.json(currentUser);
};
