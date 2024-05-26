const sequelize = require('../config/db');
const { Op } = require('sequelize');
const Mark = require("../models/Mark")
const Student = require("../models/Student")

exports.getStudents = async (req, res) => {
  try {
    const students = await sequelize.query(
      `SELECT students.*, fields.id AS fieldId, fields.name AS fieldName, marks.id AS markId, marks.subjectId, marks.marks, marks.createdAt AS markCreatedAt, marks.updatedAt AS markUpdatedAt
      FROM students
      LEFT JOIN fields ON students.fieldId = fields.id
      LEFT JOIN marks ON students.id = marks.studentId`,
      { type: sequelize.QueryTypes.SELECT }
    );

    const formattedStudents = [];
    const studentMap = {};

    students.forEach(student => {
      if (!studentMap[student.id]) {
        studentMap[student.id] = {
          id: student.id,
          username: student.username,
          password: student.password,
          enrollmentYear: student.enrollmentYear,
          fieldId: student.fieldId,
          createdAt: student.createdAt,
          updatedAt: student.updatedAt,
          field: {
            id: student.fieldId,
            name: student.fieldName,
            createdAt: student.fieldCreatedAt,
            updatedAt: student.fieldUpdatedAt
          },
          marks: []
        };
        formattedStudents.push(studentMap[student.id]);
      }

      if (student.markId) {
        studentMap[student.id].marks.push({
          id: student.markId,
          studentId: student.id,
          subjectId: student.subjectId,
          marks: student.marks,
          createdAt: student.markCreatedAt,
          updatedAt: student.markUpdatedAt
        });
      }
    });

    res.json(formattedStudents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getStudentById = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await sequelize.query(
      `SELECT students.*, fields.id AS fieldId, fields.name AS fieldName, marks.id AS markId, marks.subjectId, marks.marks, marks.createdAt AS markCreatedAt, marks.updatedAt AS markUpdatedAt
      FROM students
      LEFT JOIN fields ON students.fieldId = fields.id
      LEFT JOIN marks ON students.id = marks.studentId
      WHERE students.id = ?`,
      { replacements: [id], type: sequelize.QueryTypes.SELECT }
    );

    if (student.length > 0) {
      const studentData = {
        id: student[0].id,
        username: student[0].username,
        password: student[0].password,
        enrollmentYear: student[0].enrollmentYear,
        fieldId: student[0].fieldId,
        createdAt: student[0].createdAt,
        updatedAt: student[0].updatedAt,
        field: {
          id: student[0].fieldId,
          name: student[0].fieldName,
          createdAt: student[0].fieldCreatedAt,
          updatedAt: student[0].fieldUpdatedAt
        },
        marks: student.map(mark => ({
          id: mark.markId,
          studentId: mark.id,
          subjectId: mark.subjectId,
          marks: mark.marks,
          createdAt: mark.markCreatedAt,
          updatedAt: mark.markUpdatedAt
        })).filter(mark => mark.id)
      };

      res.json(studentData);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateStudent = async (req, res) => {
  const { id } = req.params;
  const { username, enrollmentYear, fieldId } = req.body;
  try {
    const [results] = await sequelize.query(
      `UPDATE students
      SET username = ?, enrollmentYear = ?, fieldId = ?
      WHERE id = ?`,
      { replacements: [username, enrollmentYear, fieldId, id] }
    );

    if (results.affectedRows > 0) {
      const updatedStudent = await sequelize.query(
        `SELECT * FROM students WHERE id = ?`,
        { replacements: [id], type: sequelize.QueryTypes.SELECT }
      );
      res.json(updatedStudent[0]);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteStudent = async (req, res) => {
  const { id } = req.params;
  const student = await Student.findByPk(id);
  if (student) {
    await student.destroy();
    res.status(204).send();
  } else {
    res.status(404).json({ message: 'Student not found' });
  }
};

exports.addOrUpdateMark = async (req, res) => {
  const { studentId, subjectId, marks } = req.body;
  const mark = await Mark.findOne({ where: { studentId, subjectId } });

  if (mark) {
    mark.marks = marks;
    await mark.save();
    res.json(mark);
  } else {
    const newMark = await Mark.create({ studentId, subjectId, marks });

    res.status(201).json(newMark);
  }
};

exports.getAverageTotalMarks = async (req, res) => {
  try {
    const fieldResults = await sequelize.query(
      `SELECT 
        fields.name AS fieldName, 
        AVG(marks.marks) AS averageMarks
      FROM students
      JOIN fields ON students.fieldId = fields.id
      JOIN marks ON students.id = marks.studentId
      GROUP BY fields.name`,
      { type: sequelize.QueryTypes.SELECT }
    );

    const subjectResults = await sequelize.query(
      `SELECT 
        fields.name AS fieldName,
        subjects.name AS subjectName,
        AVG(marks.marks) AS averageMarks
      FROM students
      JOIN fields ON students.fieldId = fields.id
      JOIN marks ON students.id = marks.studentId
      JOIN subjects ON marks.subjectId = subjects.id
      GROUP BY fields.name, subjects.name`,
      { type: sequelize.QueryTypes.SELECT }
    );

    const fieldWiseAverageTotalMarks = {};
    const subjectWiseAverageTotalMarks = {};

    fieldResults.forEach(row => {
      const fieldName = row.fieldName;
      const averageMarks = row.averageMarks;
      fieldWiseAverageTotalMarks[fieldName] = averageMarks;
    });

    subjectResults.forEach(row => {
      const fieldName = row.fieldName;
      const subjectName = row.subjectName;
      const averageMarks = row.averageMarks;
      if (!subjectWiseAverageTotalMarks[fieldName]) {
        subjectWiseAverageTotalMarks[fieldName] = {};
      }
      subjectWiseAverageTotalMarks[fieldName][subjectName] = averageMarks;
    });

    res.json({
      fieldWiseAverageTotalMarks,
      subjectWiseAverageTotalMarks
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




exports.getSubjectWiseHighestMarks = async (req, res) => {
  try {
    const subjectResults = await sequelize.query(
      `SELECT 
        fields.name AS fieldName,
        subjects.name AS subjectName,
        MAX(marks.marks) AS highestMarks
      FROM students
      JOIN fields ON students.fieldId = fields.id
      JOIN marks ON students.id = marks.studentId
      JOIN subjects ON marks.subjectId = subjects.id
      GROUP BY fields.name, subjects.name`,
      { type: sequelize.QueryTypes.SELECT }
    );

    const subjectWiseHighestMarks = {};

    subjectResults.forEach(row => {
      const fieldName = row.fieldName;
      const subjectName = row.subjectName;
      const highestMarks = row.highestMarks;
      if (!subjectWiseHighestMarks[fieldName]) {
        subjectWiseHighestMarks[fieldName] = {};
      }
      subjectWiseHighestMarks[fieldName][subjectName] = highestMarks;
    });

    res.json(subjectWiseHighestMarks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getTopStudents = async (req, res) => {
  try {
    const results = await sequelize.query(
      `SELECT fields.name AS fieldName, students.id AS studentId, students.username AS studentName, SUM(marks.marks) AS totalMarks
      FROM students
      JOIN fields ON students.fieldId = fields.id
      JOIN marks ON students.id = marks.studentId
      GROUP BY fields.name, students.id, students.username
      ORDER BY fields.name, totalMarks DESC`,
      { type: sequelize.QueryTypes.SELECT }
    );

    const fieldWiseHighestGrades = {};
    results.forEach(row => {
      const { fieldName, studentId, studentName, totalMarks } = row;
      if (!fieldWiseHighestGrades[fieldName] || totalMarks > fieldWiseHighestGrades[fieldName].totalMarks) {
        fieldWiseHighestGrades[fieldName] = { studentId, studentName, totalMarks };
      }
    });

    res.json(fieldWiseHighestGrades);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



exports.getSubjectPassRate = async (req, res) => {
  try {
    const subjectPassRateQuery = `
      SELECT
        f.name AS fieldName,
        s.name AS subjectName,
        AVG(CASE WHEN m.marks >= 60 THEN 1 ELSE 0 END) * 100 AS passRate
      FROM
        Fields f
      JOIN
        Students stu ON f.id = stu.fieldId
      JOIN
        Marks m ON stu.id = m.studentId
      JOIN
        Subjects s ON m.subjectId = s.id
      GROUP BY
        f.name, s.name;
    `;

    const subjectPassRates = await sequelize.query(subjectPassRateQuery, {
      type: sequelize.QueryTypes.SELECT
    });

    const fieldWiseSubjectPassRates = {};

    subjectPassRates.forEach(row => {
      const fieldName = row.fieldName;
      const subjectName = row.subjectName;
      const passRate = row.passRate;

      if (!fieldWiseSubjectPassRates[fieldName]) {
        fieldWiseSubjectPassRates[fieldName] = {};
      }

      fieldWiseSubjectPassRates[fieldName][subjectName] = passRate;
    });

    res.json(fieldWiseSubjectPassRates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getStudentsCountByField = async (req, res) => {
  try {
    const fieldResults = await sequelize.query(
      `SELECT 
        fields.name AS fieldName,
        COUNT(*) AS studentCount
      FROM students
      JOIN fields ON students.fieldId = fields.id
      GROUP BY fields.name`,
      { type: sequelize.QueryTypes.SELECT }
    );

    const studentsCountByField = {};

    fieldResults.forEach(row => {
      const fieldName = row.fieldName;
      const studentCount = row.studentCount;
      studentsCountByField[fieldName] = studentCount;
    });

    res.json(studentsCountByField);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

