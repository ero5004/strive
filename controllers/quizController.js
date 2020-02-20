const db = require('../db');

exports.quizes_index_get = async function(req, res) {
    const getQuizesQuery = "select * from quizes order by created_on desc";

    try {
        const results = await db.query(getQuizesQuery);
        if (results && results.rows) {
            const quizes = results.rows;
            res.render('quizes', {title: "All Quizes", quizes: quizes});
        } else {
            res.redirect('/quiz/create');
        }
    } catch (err) {
        console.log(err);
        res.redirect('/quiz/create');
    }

};

exports.create_quiz_get = function(req, res) {
    return res.render('create_quiz', {title: "Create A New Quiz"});
};

exports.create_quiz_post = async function(req, res) {
    const quiz_name = req.body.quiz_name;
    const quiz_details = req.body.quiz_details;

    const addQuizQuery = "insert into quizes (name, description, created_on) values ($1, $2, CURRENT_TIMESTAMP) returning quiz_id";

    var quiz_id;

    try {
        const results = await db.query(addQuizQuery, [quiz_name, quiz_details]);
        if (results && results.rows) {
            quiz_id = results.rows[0].quiz_id;
        }
    } catch (err) {
        console.log(err);
        res.redirect('/quiz');
    }

    if (quiz_id) {
        res.redirect('/quiz/' + quiz_id);
    } else {
        res.redirect('/quiz');
    }
};

exports.quiz_details_get = async function(req, res) {
    const quiz_id = req.params.quiz_id;
    try {
        const questions = await db.get_quiz_questions(quiz_id);

        const getResponsesQuery = "select * from respondents where quiz_id = $1 order by started_on desc";
        const results = db.query(getResponsesQuery, [quiz_id]);
        var responses = [];
        if (results && results.rows) {
            responses = results.rows;
        }
        
        return res.render('quiz_details', {title: 'Quiz Details', questions: questions, quiz_id: quiz_id, responses: responses});

    } catch (err) {
        console.log(err);
        res.redirect('/quiz');
    }
};

exports.create_quiz_question_get = function(req, res) {
    const quiz_id = req.params.quiz_id;
    return res.render('create_question', {title: "Add a Question", quiz_id: quiz_id})
};


exports.create_quiz_question_post = async function(req, res) {
    const quiz_id = req.params.quiz_id;
    const question_text = req.body.question_text;

    const createQuestionQuery = "insert into questions (quiz_id, question_text, created_on) values ($1, $2, CURRENT_TIMESTAMP)";

    try {
        await db.query(createQuestionQuery, [quiz_id, question_text]);

        res.redirect('/quiz/' + quiz_id);
    } catch (err) {
        console.log(err);
        res.redirect('/quiz');
    }
};

/**
 * Generate a respondent id and get the first question to render. 
 */
exports.start_quiz_get = async function(req, res) {
    const quiz_id = req.params.quiz_id;
    var respondent_id = -1;

    /**
     * Scaffolding to include respondent name and details in the future
     */
    const name = "Test Name";
    const details = "Test Details";

    try {
        respondent_id = await db.create_quiz_respondent(quiz_id, name, details);
        const questions = await db.get_quiz_questions(quiz_id);

        if (questions && questions.length > 0) {
            const firstQuestion = questions[0];
            const question_number = 0;
            const total_questions = questions.length;
            res.render('quiz_question', {title: 'Quiz Question', quiz_id: quiz_id, question: firstQuestion, question_number: question_number, total_questions: total_questions, respondent_id: respondent_id})
        } else {
            console.log("No questions in this quiz");
            res.redirect('/quiz');
        }
    } catch (err) {
        console.log(err);
        res.redirect('/quiz');
    }

    

    
};

exports.submit_quiz_question_post = async function(req, res) {

    console.log(JSON.stringify(req.body));

    const quiz_id = req.params.quiz_id;

    const question_id = req.body.question_id;
    /**
     * question_number is being used to keep track of which question in the quiz was just answered. 
     * Potential bug - what if another user deletes questions from the database while this quiz is being taken?
     * This would likely put the next_question_number out of sync.
     */
    const next_question_number = parseInt(req.body.question_number) + 1;
    const answer_text = req.body.answer_text;
    const respondent_id = parseInt(req.body.respondent_id);

    const insertAnswerQuery = "insert into answers (quiz_id, question_id, respondent_id, answer_text) values ($1, $2, $3, $4)";

    try {
        await db.query(insertAnswerQuery, [quiz_id, question_id, respondent_id, answer_text]);

        const questions = await db.get_quiz_questions(quiz_id);
        console.log(JSON.stringify(questions));
        if (questions && questions.length > 0 && questions.length > next_question_number) {
            const nextQuestion = questions[next_question_number];
            const total_questions = questions.length;
            return res.render('quiz_question', {title: 'Quiz Question', question: nextQuestion, question_number: next_question_number, total_questions: total_questions, respondent_id: respondent_id} );
        } else if (questions.length <= next_question_number) {
            //if the next question is equal to the total number of questions, that means all questions have had answers submitted.
            const updateCompletedResponseQuery = "update respondents set ended_on = CURRENT_TIMESTAMP where respondent_id = $1";
            await db.query(updateCompletedResponseQuery, [respondent_id]);

            res.redirect('/quiz/' + quiz_id + '/results/' + respondent_id);
        }
    } catch (err) {
        console.log(err);
        res.redirect('/quiz');
    }
    res.redirect('/quiz');
};

/**
 * Should probably also display details about this respondent like their name and when they started and finished the quis.
 */
exports.quiz_results_get = async function(req, res) {
    const quiz_id = req.params.quiz_id;
    const respondent_id = req.params.respondent_id;

    const getAnswersQuery = "select * from answers inner join questions on answers.question_id = questions.question_id where quiz_id = $1 and respondent_id = $2 order by question_id asc";

    try {
        const results = await db.query(getAnswersQuery, [quiz_id, respondent_id]);
        if (results && results.rows) {
            const answers = results.rows;
            return res.render('quiz_response', {title: "Submitted Responses", answers: answers});
        } else {
            res.redirect('/quiz');
        }
    } catch (err) {
        console.log(err);
        res.redirect('/quiz');
    }
}