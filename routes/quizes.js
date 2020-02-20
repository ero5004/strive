var express = require('express');
var router = express.Router();

const quizesController = require('../controllers/quizController');

router.get('/', quizesController.quizes_index_get);
router.get('/:quiz_id', quizesController.quiz_details_get);
router.get(':quiz_id/results/:respondent_id', quizesController.quiz_results_get);

router.get('/create', quizesController.create_quiz_get);
router.post('/create', quizesController.create_quiz_post);

router.get('/:quiz_id/create', quizesController.create_quiz_question_get);
router.post('/:quiz_id/create', quizesController.create_quiz_question_post);



router.get('/:quiz_id/start', quizesController.start_quiz_get);
router.post('/:quiz_id/submit/:question_id', quizesController.submit_quiz_question_post);



module.exports = router;