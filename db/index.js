const { Pool } = require('pg');

const connectionString = "postgres://localhost/strive";


const pool = new Pool({
    connectionString: connectionString
});

exports.query = function(text, params) {
    return pool.query(text, params);
};

exports.get_quiz_questions = async function(quiz_id) {
    const getQuizQuestionsQuery = "select * from questions where quiz_id = $1 order by question_id asc";

    try {
        const results = await pool.query(getQuizQuestionsQuery, [quiz_id]);
        if (results && results.rows) {
            return results.rows;
        }
    } catch (err) {
        console.log("error getting quiz questions: " + err);
        return [];
    }
    return [];
};

exports.create_quiz_respondent = async function(quiz_id, name, details) {
    const createRespondentQuery = "insert into respondents (quiz_id, name, details, started_on) values ($1, $2, $3, CURRENT_TIMESTAMP) returning respondent_id";


    try {
        const results = await pool.query(createRespondentQuery,[quiz_id, name, details]);
        if (results && results.rows) {
            return results.rows[0].respondent_id
        } else {
            return -1;
        }
    } catch (err) {
        console.log("error creating new quiz respondent: " + err);
        return -1;
    }
};