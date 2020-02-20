# Strive Technical Challenge - Eric Obeysekare
I implmented this project using Express.js that uses Pug.js for the front end rendering. The project scaffolding was generated using express-generator to quickly get started.

## Database setup
* A running Postgres Server is needed. I used [Postgres.app](https://postgresapp.com/) running locally on my mac mini.
* Create a database on the running db server (I called mine strive)
* If you are using a different server or db name, please update the postgres connection string in the db/index.js file
### Table Creation Scripts
* Note - I created and modifed my db using the pgAdmin tool and then extracted these scripts from there. I also did not implement true foreign keys in the interest of saving time and potential headaches.

Quizes:
```
CREATE TABLE quizes
(
    quiz_id SERIAL,
    name text,
    description text,
    created_on timestamp with time zone,
    CONSTRAINT quizes_pkey PRIMARY KEY (quiz_id)
)
```
Questions:
```
CREATE TABLE questions
(
    question_id SERIAL,
    quiz_id integer,
    question_text text,
    created_on timestamp with time zone, 
    CONSTRAINT questions_pkey PRIMARY KEY (question_id)
)
```
Respondents:
```
CREATE TABLE respondents
(
    respondent_id SERIAL,
    quiz_id integer,
    started_on timestamp with time zone, 
    ended_on timestamp with time zone, 
    name text,
    details text, 
    CONSTRAINT respondents_pkey PRIMARY KEY (respondent)
)
```
Answers:
```
CREATE TABLE answers
(
    answer_id SERIAL,
    quiz_id integer,
    question_id integer,
    respondent_id integer,
    answer_text text,
    score text, 
    CONSTRAINT answers_pkey PRIMARY KEY (answers_id)
)
```
## Running the code
* Run 'npm install' in the top directory after cloning the repo.
* Run 'npm run devstart' to start the app in dev mode (which uses nodemon to quickly restart the app when changes are made). The web app will then be available on localhost:3000/quiz

## Using the web app
* '/quiz/' will show a list of all the quizes that have been created. You can click on a quiz to see details about the quiz's questions and already submitted responses.
* '/quiz/:quiz_id' shows details about one particular quiz (as just mentioned). The link to start taking a quiz is found on this page.
* Beyond this, I hope that the other things the app is doing are relatively straightforward and I'm happy to explain more specifics as desired.

## Reflecting on what I had time to build
* Unfortunately, I was not able to implement the 3 minute timer in the alloted time. I left this until last to do as I only had a slight idea of how to do it and wanted to get other stuff done first.
* The quality of the UI is obviously much lower than the given example. I definitely know that frontend development is one of my weaknesses which led me to use a rendering system that was simple and that I already knew - pug.js.
* I added a few comments in places where I saw potential bugs or needed to make notes for myself but I think the code could use more comments. Specifcally, I felt that the 'submit_quiz_question_post' method in /controllers/quizController.js is a little confusing and has some of the more dense code in the project.