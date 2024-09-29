const express = require("express");
const axios = require('axios');
const { OpenAI } = require("openai");
const path = require("path")
require("dotenv").config()
const cors = require('cors');



const app = express();
app.use(cors());
app.use(express.json());
//app.use(express.static(path.join(__dirname, "build")));

//placeholder 
let studentProfile = {
    transcript: [
        ["Math", "B", 1],
        ["English", "B", 2],
        ["Biology", "B", 3],
        ["History", "B", 4],
        ["Physics", "B", 4],
        ["Chemistry", "B", 3],
        ["Computer Science", "B", 2]
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

let scoreBounds = [175, 2950]
let scoreDistribution = [1350, 2000, 2250]

function computeStandardizedScore(studentProfile) {
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

    studentProfile.transcript.forEach(([subject, grade]) => {
        let gradeValue = gradeMap[grade] || 0;
        let adjustedValue = gradeValue;
        if (subject.startsWith("AP")) {
            adjustedValue += 0.5;
        }
        totalPoints += gradeValue;
        adjustedPoints += adjustedValue;
        totalClasses++;
    });

    const gpa = totalPoints / totalClasses * 1.0;
    studentProfile.gpa = gpa 
    score += adjustedPoints/totalClasses * 500;

    /*studentProfile.transcript.forEach(([subject, grade, year]) => {
        let gradeValue = gradeMap[grade] || 0;
        if (subject.startsWith("AP")) {
            gradeValue += 0.5;
        }
        if (year === 1) {
            gradeValue *= 0.9;
        }
        score += gradeValue * 50;
    });*/

    const satScore = studentProfile.SAT ? (studentProfile.SAT / 1600) * 300 : 0;
    const actScore = studentProfile.ACT ? (studentProfile.ACT / 36) * 300 : 0;
    let testScore = Math.max(studentProfile.SAT, studentProfile.ACT)
    score += Math.max(satScore, actScore);
    studentProfile.testScore = testScore

    const apScores = studentProfile.AP_scores.map(([exam, apScore]) => apScore);
    const avgAPScore = apScores.length > 0 ? apScores.reduce((a, b) => a + b) / apScores.length : 0;
    score += avgAPScore * 100;

    console.log(`Standardized Score: ${score}`);
    return score;
}

const API_KEY = process.env.API_KEY;

const openai = new OpenAI(
    {apiKey: API_KEY}
)

app.post('/api/college-data', async(req, res)=>{
    const studentProfile = req.body 
    const score = computeStandardizedScore(studentProfile);
    try{
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {role: "system", content: `DO NOT GIVE A RESPONSE: The following table represents a distribution of standardized scores as calculated from an algorithm: ${scoreDistribution} in order of a lower end performance (C average grades, ~800 SAT, average AP score of 2), average performance (average B grades, ~1050 SAT, average AP score of 3), and a good academic performance (average A- grades, 1300 SAT, average AP score of 4). The maximum bounds of this score are given as follows: ${scoreBounds}. Keep in mind that the lower and upper bounds of score refer to the absolute worst value (failing student) and absolute best value (perfect student). These bounds are not realistic, but should be used to compare scores and evaluate precisely. `},
                {role: "system", content: `DO NOT GIVE A RESPONSE: For all future responses you will be as logical and direct as possible. You will be given student academic information and will be asked to evaluate that academic performance to give college application advice. This means that you must genuinely evaluate data and give accurate college choices and realistic acceptance possibilities. It is fine to give some reach schools which align with criteria, however, be realistic. If a student's performance is average or only slightly above average, do not suggest top universities which will be significantly more selective.`},
                {role: "user", content: `There is a student profile with a standardized score of ${score}, GPA of ${studentProfile.gpa}, and SAT/ACT of ${studentProfile.testScore}. Score is calculated based on a combination of GPA, Test Scores, and AP Exam scores.
                The student is interested in the following degree programs in order of preference: ${studentProfile.degree_preferences.join(", ")}. 
                Additionally, their interests include: ${studentProfile.interests.join(", ")}.
                Please analyze this information and provide a list of colleges that would be a good fit based on their scores, interests, and desired majors, considering that if the second choice major has much better options, it should carry higher weight than usual. 
                Also, compare their GPA and test score against the distribution of GPAs and test scores typical of these universities. Use this comparison to evaluate whether that university is a good fit. Listed universities should be the best possible fits. Remember to compare the student's standardized score to the table of standardized score distributions as a way to evaluate their edge over other applicants.`}
            ],
        });
        res.json({test: score});
        //console.log(response.choices[0].message.content)
    }
    catch(error){
        console.log(error.message)
        res.status(500).json({ error: 'Failed' });
    }

})

async function fetchCollegeRecommendations(studentProfile) {
    const score = computeStandardizedScore(studentProfile);
    try{
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {role: "system", content: `DO NOT GIVE A RESPONSE: The following table represents a distribution of standardized scores as calculated from an algorithm: ${scoreDistribution} in order of a lower end performance (C average grades, ~800 SAT, average AP score of 2), average performance (average B grades, ~1050 SAT, average AP score of 3), and a good academic performance (average A- grades, 1300 SAT, average AP score of 4). The maximum bounds of this score are given as follows: ${scoreBounds}. Keep in mind that the lower and upper bounds of score refer to the absolute worst value (failing student) and absolute best value (perfect student). These bounds are not realistic, but should be used to compare scores and evaluate precisely. `},
                {role: "system", content: `DO NOT GIVE A RESPONSE: For all future responses you will be as logical and direct as possible. You will be given student academic information and will be asked to evaluate that academic performance to give college application advice. This means that you must genuinely evaluate data and give accurate college choices and realistic acceptance possibilities. It is fine to give some reach schools which align with criteria, however, be realistic. If a student's performance is average or only slightly above average, do not suggest top universities which will be significantly more selective.`},
                {role: "user", content: `There is a student profile with a standardized score of ${score}, GPA of ${studentProfile.gpa}, and SAT/ACT of ${studentProfile.testScore}. Score is calculated based on a combination of GPA, Test Scores, and AP Exam scores.
                The student is interested in the following degree programs in order of preference: ${studentProfile.degree_preferences.join(", ")}. 
                Additionally, their interests include: ${studentProfile.interests.join(", ")}.
                Please analyze this information and provide a list of colleges that would be a good fit based on their scores, interests, and desired majors, considering that if the second choice major has much better options, it should carry higher weight than usual. 
                Also, compare their GPA and test score against the distribution of GPAs and test scores typical of these universities. Use this comparison to evaluate whether that university is a good fit. Listed universities should be the best possible fits. Remember to compare the student's standardized score to the table of standardized score distributions as a way to evaluate their edge over other applicants.`}
            ],
        });
        console.log(response.choices[0].message.content)
    }
    catch(error){
        console.log(error.message)
    }
}
//fetchCollegeRecommendations(studentProfile)

app.listen(5000, () => {
    console.log(`Server running on port ${5000}`);
});