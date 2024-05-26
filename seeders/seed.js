const sequelize = require('../config/db');
const Field = require('../models/Field');
const Student = require('../models/Student');
const Subject = require('../models/Subject');
const Mark = require('../models/Mark');
const bcrypt = require('bcrypt');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  // Creating fields
  const fields = await Field.bulkCreate([
    { name: 'Engineering' },
    { name: 'Arts' }
  ]);

  console.log(fields)

  // Creating students
  const saltRounds = 10;
  const hashedPasswords = Array.from({ length: 100 }, () => bcrypt.hashSync('hashedpassword', saltRounds));
  const students = await Student.bulkCreate(Array.from({ length: 100 }, (_, index) => ({
    username: `user_${index}`,
    password: hashedPasswords[index % hashedPasswords.length],
    enrollmentYear: 2021 + (index % 4), // Varying enrollment years
    fieldId: fields[index % fields.length].id,
  })));

  // Creating subjects
  const subjects = await Subject.bulkCreate([
    { name: 'Maths', fieldId: fields[0].id },
    { name: 'Physics', fieldId: fields[0].id },
    { name: 'Creative Writing', fieldId: fields[1].id },
    { name: 'Play Writing', fieldId: fields[1].id },
    { name: 'Engineering Chemistry', fieldId: fields[0].id },
  ]);

// Create marks
const marks = [];
const subjectsCount = subjects.length;
let subjectIndex = 0; // Initializing subject index

for (const student of students) {
  const studentField = student.fieldId; // Getting student's field
  const subjectsInField = subjects.filter(subject => subject.fieldId === studentField);
  // Filtering subjects that belong to the student's field
  
  for (const subject of subjectsInField) {
    marks.push({
      studentId: student.id,
      subjectId: subject.id,
      marks: Math.floor(Math.random() * 101), // Randomizing marks between 0 to 100
    });
    subjectIndex = (subjectIndex + 1) % subjectsCount; // Moving to the next subject cyclically
  }
}

await Mark.bulkCreate(marks);

  console.log('Database seeded!');
};

seedDatabase().catch(error => {
  console.error('Error seeding database:', error);
  process.exit(1);
});
