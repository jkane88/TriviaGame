$(document).ready(function () {

    let game = {
        clock: '',
        round: 0,
        timeLeft: 25,
        correct: 0,
        wrong: 0,
        notAnswered: 0,
        question: '',
        correctAnswer: '',
        answers: [],
        queryResults: [],
        possibleAnswers: [],

        // start game 
        init: function () {
        this.findQuestions();
        },

        // show game screen
        gameStart: function () {
            this.round = 0;
            this.clock = '';
            this.timeLeft = 25;
            this.correct = 0;
            this.wrong = 0;
            this.notAnswered = 0;
            this.queryResults = [];
            this.question = '';
            this.correctAnswer = '';
            this.answers = [];

        },

        startTime: function () {
            this.clock = setInterval(function () {
                game.timeLeft--;
                $('#game-text').text(game.timeLeft);

                // if time === 0, then do stuff and also stopTimer()
                if (game.timeLeft === 0) {
                    game.notAnswered++;
                    game.round++;
                    game.showAnswer();
                    game.stopTimer();
                    game.getQuestions();
                }
            }, 1000);
           
        },
        // stop timer
        stopTimer: function () {
            clearInterval(game.clock);
        },

        resetTimer: function () {
            // reset timeleft to 30 
            this.timeLeft = 25;
        },

        getQuestions: function () {

            // Query url
            queryUrl = "https://opentdb.com/api.php?amount=10&category=12&difficulty=medium&type=multiple";

            // Make the request
            $.ajax({
                url: queryUrl,
                method: 'GET'
            }).then(function (response) {
                game.queryResults = response.results;
                // console.log(response);
                game.showQuestion(game.round);
            
            });
        },

        showQuestion: function (number) {
            game.stopTimer();
            game.resetTimer();
            game.question = game.queryResults[number].question;

            // Get the answers
            game.answers = this.queryResults[number].incorrect_answers;
            game.correctAnswer = game.decodeString(this.queryResults[number].correct_answer);
            game.answers.push(this.correctAnswer);

            // clear previous question & answers
            $('#question').empty();
            // $('#answers').empty();

            // show question
            $('#question').text('#' + (game.round + 1) + ': ' + game.decodeString(game.queryResults[game.round].question));
            console.log(game.question);
            game.answers.push(game.correctAnswer);
            // game.possibleAnswers.push(game.correctAnswer);
            game.answers.sort(function() {return 0.5 - Math.random()});
            // game.possibleAnswers.sort(function () {return 0.5 - Math.random()});

            $(".answers").each(function (index, value) {
                $(this).text(game.decodeString(game.answers[index]));
                
            
            });
            game.startTime();
            
        },
        showAnswer: function () {
            $('#game-text').text(game.correctAnswer);
            setTimeout(() => {
                game.resetTimer();
            }, 3000);
           
        },

        // Add answer buttons to #answers
        makeButtons: function () {
            $.each(game.answers, function (index, incorrect_answers) {
                let answerButton = $('<div>').addClass('text-center answer select').text(game.decodeString(answers));

                $('#answers').append(answerButton);
                
            });
        },


        // Helped by Jason Michael to find this on stack overflow
        decodeString: function (encodedStr) {
            let textArea = document.createElement('textArea');
            textArea.innerHTML = encodedStr;

            let decodedStr = textArea.value;
            textArea.remove();

            return decodedStr;
        }

        
    };


    $(document).on('click', '#start-button', function () {
        game.getQuestions();
        $('#start-button').hide();
        $('#game-stats').hide();
        $('#answers').show();
        $('#secondRow').show();
        console.log(game.queryResults);
        game.gameStart();
    })

    $(document).on('click', '.answers', function () {

        // console.log($(this).text());
        if ($(this).text() === game.correctAnswer) {
            console.log('correct')
            game.correct++;
            $('#game-text').text("CORRECT!");


        } else {
            game.wrong++;
            $('#game-text').text(game.showAnswer());
            
            
        }
        game.round++;
        if (game.round === 10) {
            game.stopTimer();
            $('#start-button').show();
            $('#game-stats').show();
            $('#correctAnswers').text('Correct Answers: ' + game.correct);
            $('#incorrectAnswers').text('Incorrect Answers: ' + game.wrong);
            $('#notAnswered').text('Not Answered: ' + game.notAnswered);
            console.log(game.correct);
        }
        else {
            game.stopTimer();
            setTimeout(function () {
                game.showQuestion(game.round);
                
            }, 3000)
        }
    })
});

// sort answers - done
// show game stats - done
// restart game without reloading page - done
// fix timer - done
// fix next question/round count - done 
// hide/show info during/after game 

