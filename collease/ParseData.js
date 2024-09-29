const express = require("express");
const axios = require('axios');
const { OpenAI } = require("openai");
const path = require("path");
require("dotenv").config();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Placeholder student profile object with sample data
let studentProfile = {
    transcript: [
        { year: 1, courses: [
            ["Math", "B"],
            ["Biology", "B"],
            ["History", "B"],
            ["Physics", "B"],
            ["Chemistry", "B"],
        ]},
        { year: 2, courses: [
            ["English", "B"],
            ["Computer Science", "B"]
        ]},
    ],
    gpa: 4.0,
    SAT: 1300,
    ACT: null,
    testScore: null,
    AP_scores: [
        ["AP Calculus", 4],
        ["AP Physics", 4],
        ["AP Computer Science", 4]
    ],
    location: ["New York", "NY"],
    interests: ["Engineering", "Mathematics", "Computer Science"],
    degree_preferences: ["Computer Science", "Engineering", "Mathematics"],
    school_size: "Medium",
};

let scoreBounds = [175, 2950];
let scoreDistribution = [1350, 2000, 2250];

// Function to compute a standardized score based on GPA, test scores, and other factors
function computeStandardizedScore(studentProfile) {
    console.log(studentProfile);
    const gradeMap = {
        "A+": 4.3,
        "A": 4.0,
        "A-": 3.7,
        "B+": 3.3,
        "B": 3.0,
        "B-": 2.7,
        "C+": 2.3,
        "C": 2.0,
        "C-": 1.7,
        "D+": 1.3,
        "D": 1.0,
        "F": 0.0
    };

    let score = 0;
    let totalPoints = 0;
    let adjustedPoints = 0;
    let totalClasses = 0;

    studentProfile.transcript.forEach(({ courses }) => {
        courses.forEach(([subject, grade]) => {
            let gradeValue = gradeMap[grade] || 0;
            let adjustedValue = gradeValue;
            if (subject.startsWith("AP")) {
                adjustedValue += 0.5;
            }
            totalPoints += gradeValue;
            adjustedPoints += adjustedValue;
            totalClasses++;
        });
    });

    const gpa = totalPoints / totalClasses * 1.0;
    studentProfile.gpa = gpa;
    score += adjustedPoints / totalClasses * 500;

    const satScore = studentProfile.SAT ? (studentProfile.SAT / 1600) * 300 : 0;
    const actScore = studentProfile.ACT ? (studentProfile.ACT / 36) * 300 : 0;
    let testScore = Math.max(studentProfile.SAT, studentProfile.ACT);
    score += Math.max(satScore, actScore);
    studentProfile.testScore = testScore;

    const apScores = studentProfile.AP_scores.map(([exam, apScore]) => apScore);
    const avgAPScore = apScores.length > 0 ? apScores.reduce((a, b) => a + b) / apScores.length : 0;
    score += avgAPScore * 100;

    console.log(`Standardized Score: ${score}`);
    return score;
}

const API_KEY = process.env.API_KEY;

const openai = new OpenAI({ apiKey: API_KEY });

// POST route to handle student profile submission and generate a score
app.post('/api/college-data', async (req, res) => {
    const studentProfile = req.body; // Get student profile from request body
    const score = computeStandardizedScore(studentProfile); // Compute the standardized score
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {role: "system", content: `DO NOT GIVE A RESPONSE: The following table represents a distribution of standardized scores as calculated from an algorithm: ${scoreDistribution} in order of a lower-end performance (C average grades, ~800 SAT, average AP score of 2), average performance (average B grades, ~1050 SAT, average AP score of 3), and a good academic performance (average A- grades, 1300 SAT, average AP score of 4). The maximum bounds of this score are given as follows: ${scoreBounds}. Keep in mind that the lower and upper bounds of score refer to the absolute worst value (failing student) and absolute best value (perfect student). These bounds are not realistic, but should be used to compare scores and evaluate precisely.`},
                {role: "system", content: `DO NOT GIVE A RESPONSE: For all future responses you will be as logical and direct as possible. You will be given student academic information and will be asked to evaluate that academic performance to give college application advice. This means that you must genuinely evaluate data and give accurate college choices and realistic acceptance possibilities. It is fine to give some reach schools which align with criteria, however, be realistic. If a student's performance is average or only slightly above average, do not suggest top universities which will be significantly more selective.`},
                {role: "user", content: `There is a student profile with a standardized score of ${score}, GPA of ${studentProfile.gpa}, and SAT/ACT of ${studentProfile.testScore}. Score is calculated based on a combination of GPA, Test Scores, and AP Exam scores. The student is interested in the following degree programs in order of preference: ${studentProfile.degree_preferences.join(", ")}. Additionally, their interests include: ${studentProfile.interests.join(", ")}. Please analyze this information and provide a list of colleges that would be a good fit based on their scores, interests, and desired majors, considering that if the second choice major has much better options, it should carry higher weight than usual. Also, compare their GPA and test score against the distribution of GPAs and test scores typical of these universities. Use this comparison to evaluate whether that university is a good fit. Listed universities should be the best possible fits. Remember to compare the student's standardized score to the table of standardized score distributions as a way to evaluate their edge over other applicants.`},
                {role: "user", content: `Focus specifically on the #1 college from your list. I would like you to respond in a very specific way, as this data is being handled by a script. You will provide your response as bulleted list of the following, with the dash (-) being a bullet point WITH NO EXCESS NON BULLETED TEXT AND DO NOT INCLUDE THE FIELD NAME (for example simply replace university name with the name of the school), JUST PUT THE VALUE: - University name - Description of why that university was selected based on student academic data - University strengths relevant to the student's desired major and interests, with major being much more important. `},
                {role: "user", content: `Focus specifically on the #2 college from your list. I would like you to respond in a very specific way, as this data is being handled by a script. You will provide your response as bulleted list of the following, with the dash (-) being a bullet point WITH NO EXCESS NON BULLETED TEXT AND DO NOT INCLUDE THE FIELD NAME, JUST PUT THE VALUE: - University name - Description of why that university was selected based on student academic data - University strengths relevant to the student's desired major and interests, with major being much more important. `},
                {role: "user", content: `Focus specifically on the #3 college from your list. I would like you to respond in a very specific way, as this data is being handled by a script. You will provide your response as bulleted list of the following, with the dash (-) being a bullet point WITH NO EXCESS NON BULLETED TEXT AND DO NOT INCLUDE THE FIELD NAME, JUST PUT THE VALUE: - University name - Description of why that university was selected based on student academic data - University strengths relevant to the student's desired major and interests, with major being much more important. `},
                {role: "user", content: `Focus specifically on the #4 college from your list. I would like you to respond in a very specific way, as this data is being handled by a script. You will provide your response as bulleted list of the following, with the dash (-) being a bullet point WITH NO EXCESS NON BULLETED TEXT AND DO NOT INCLUDE THE FIELD NAME, JUST PUT THE VALUE: - University name - Description of why that university was selected based on student academic data - University strengths relevant to the student's desired major and interests, with major being much more important. `},
                {role: "user", content: `Focus specifically on the #5 college from your list. I would like you to respond in a very specific way, as this data is being handled by a script. You will provide your response as bulleted list of the following, with the dash (-) being a bullet point WITH NO EXCESS NON BULLETED TEXT AND DO NOT INCLUDE THE FIELD NAME, JUST PUT THE VALUE: - University name - Description of why that university was selected based on student academic data - University strengths relevant to the student's desired major and interests, with major being much more important. `},
            ],
            n: 6
        });
        let data = {}
        for (let i = 1; i < response.choices.length; i++){
            let parseResponse = response.choices[i].message.content.split("- ")
            console.log(parseResponse)
            data["University" + String(i)] = {
                Name: parseResponse[1],
                Strengths: parseResponse[2],
                Description: parseResponse[3]
            }
        }
        res.json(data);
        console.log(data)
        // You can uncomment this to log the response if needed.
        // console.log(response.choices[0].message.content);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Failed to process request' });
    }
});

// Example function that could call OpenAI to generate college recommendations based on student profile
async function fetchCollegeRecommendations(studentProfile) {
    const score = computeStandardizedScore(studentProfile); // Calculate standardized score
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {role: "system", content: `DO NOT GIVE A RESPONSE: The following table represents a distribution of standardized scores as calculated from an algorithm: ${scoreDistribution} in order of a lower-end performance (C average grades, ~800 SAT, average AP score of 2), average performance (average B grades, ~1050 SAT, average AP score of 3), and a good academic performance (average A- grades, 1300 SAT, average AP score of 4). The maximum bounds of this score are given as follows: ${scoreBounds}. Keep in mind that the lower and upper bounds of score refer to the absolute worst value (failing student) and absolute best value (perfect student). These bounds are not realistic, but should be used to compare scores and evaluate precisely.`},
                {role: "system", content: `DO NOT GIVE A RESPONSE: For all future responses you will be as logical and direct as possible. You will be given student academic information and will be asked to evaluate that academic performance to give college application advice. This means that you must genuinely evaluate data and give accurate college choices and realistic acceptance possibilities. It is fine to give some reach schools which align with criteria, however, be realistic. If a student's performance is average or only slightly above average, do not suggest top universities which will be significantly more selective.`},
                {role: "user", content: `There is a student profile with a standardized score of ${score}, GPA of ${studentProfile.gpa}, and SAT/ACT of ${studentProfile.testScore}. The student is interested in the following degree programs in order of preference: ${studentProfile.degree_preferences.join(", ")}. Additionally, their interests include: ${studentProfile.interests.join(", ")}. Please analyze this information and provide a top 5 list of colleges that would be a good fit based on their scores, interests, and desired majors.`},
                {role: "user", content: `Focus specifically on the #1 college from your list. I would like you to respond in a very specific way, as this data is being handled by a script. You will provide your response as bulleted list of the following, with the dash (-) being a bullet point WITH NO EXCESS NON BULLETED TEXT: - University name\n - Description of why that university was selected\n- University strengths relevant to the student's desired major and interests, with major being much more important. `}
            ],
        });
        let data = {  }
        for (let i = 1; i < response.choices.length; i++){
            let parseResponse = response.choices[i].message.content.split("- ")
            data["University" + String(i)] = {
                Name: parseResponse[0],
                Strengths: parseResponse[1],
                Description: parseResponse[2]
            }
        }

        console.log(data); // Log the response from OpenAI
    } catch (error) {
        console.log(error.message);
    }
}

// Start the server on port 5001
app.listen(5001, () => {
    console.log(`Server running on port 5001`);
});
