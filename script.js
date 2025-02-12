const quizQuestions = {
    "Constitutional Law": [
        {
            question: "What is the primary purpose of a constitution?",
            options: [
                "To govern judicial proceedings",
                "To establish the fundamental principles of government",
                "To regulate trade between nations",
                "To enact laws for specific crimes"
            ],
            correct: 1
        },
        {
            question: "Which amendment in the U.S. Constitution guarantees freedom of speech?",
            options: ["First Amendment", "Second Amendment", "Fifth Amendment", "Tenth Amendment"],
            correct: 0
        },
    ],
    "Criminal Law": [
        {
            question: "What is the term for a crime that is less severe than a felony?",
            options: ["Infraction", "Misdemeanor", "Petty Crime", "Larceny"],
            correct: 1
        },
        {
            question: "What is the standard of proof required in a criminal trial?",
            options: ["Preponderance of evidence", "Beyond a reasonable doubt", "Clear and convincing evidence", "Probable cause"],
            correct: 1
        },
    ],
    "Contract Law": [
        {
            question: "Which of the following is NOT required to form a valid contract?",
            options: ["Offer", "Consideration", "Mutual assent", "A written document"],
            correct: 3
        },
        {
            question: "What is the term for the failure to perform a contractual obligation?",
            options: ["Breach of contract", "Fraud", "Negligence", "Misrepresentation"],
            correct: 0
        },
    ]
};

function updateProgress() {
    const answered = document.querySelectorAll('input[type="radio"]:checked').length;
    const total = document.querySelectorAll('.question-container').length;

    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');

    const percentage = (answered / total) * 100;
    progressBar.style.width = `${percentage}%`;
    progressText.textContent = `Questions Answered: ${answered}/${total}`;
}

function createQuiz(topic) {
    const allQuestions = quizQuestions[topic];
    if (!allQuestions) return;

    const questions = allQuestions.sort(() => Math.random() - 0.5).slice(0, 5);

    const quizContainer = document.getElementById('quizContainer');
    const progressContainer = document.getElementById('progressContainer');

    quizContainer.style.display = 'block';
    progressContainer.style.display = 'block';
    quizContainer.innerHTML = '';

    questions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-container';
        questionDiv.dataset.correct = q.correct;

        const questionText = document.createElement('div');
        questionText.className = 'question';
        questionText.textContent = `${index + 1}. ${q.question}`;

        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'options';

        q.options.forEach((opt, optIndex) => {
            const option = document.createElement('label');
            option.className = 'option';

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = `question${index}`;
            radio.value = optIndex;
            radio.addEventListener('change', updateProgress);

            const optionText = document.createTextNode(opt);
            const resultIndicator = document.createElement('span');
            resultIndicator.className = 'result-indicator';
            resultIndicator.innerHTML = '✓';

            option.appendChild(radio);
            option.appendChild(optionText);
            option.appendChild(resultIndicator);
            optionsDiv.appendChild(option);
        });

        questionDiv.appendChild(questionText);
        questionDiv.appendChild(optionsDiv);
        quizContainer.appendChild(questionDiv);
    });

    const submitButton = document.createElement('button');
    submitButton.className = 'submit-btn';
    submitButton.textContent = 'Submit Quiz';
    submitButton.disabled = true;

    const enableSubmitButton = () => {
        const totalQuestions = document.querySelectorAll('.question-container').length;
        const answeredQuestions = document.querySelectorAll('input[type="radio"]:checked').length;
        submitButton.disabled = answeredQuestions < totalQuestions;
    };

    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', enableSubmitButton);
    });

    submitButton.onclick = () => {
        checkAnswers();
        submitButton.style.display = 'none';
    };

    quizContainer.appendChild(submitButton);

    updateProgress();
}

function checkAnswers() {
    const questionContainers = document.querySelectorAll('.question-container');
    let score = 0;

    questionContainers.forEach((container, index) => {
        const selectedOption = container.querySelector(`input[name="question${index}"]:checked`);
        const resultIndicators = container.querySelectorAll('.result-indicator');

        resultIndicators.forEach(indicator => {
            indicator.style.display = 'none';
        });

        if (selectedOption) {
            const correctAnswer = parseInt(container.dataset.correct);
            const isCorrect = parseInt(selectedOption.value) === correctAnswer;

            const indicator = selectedOption.parentElement.querySelector('.result-indicator');
            indicator.innerHTML = isCorrect ? '✓' : '✗';
            indicator.className = `result-indicator ${isCorrect ? 'correct' : 'incorrect'}`;
            indicator.style.display = 'inline';

            if (isCorrect) score++;
        }
    });

    const scorePopup = document.createElement('div');
    scorePopup.className = 'score-popup';
    scorePopup.style.display = 'block';

    const scorePopupContent = document.createElement('div');
    scorePopupContent.className = 'score-popup-content';

    const scoreDisplay = document.createElement('div');
    scoreDisplay.className = 'score-display';
    scoreDisplay.textContent = `Your score: ${score}/${questionContainers.length}`;

    const tryAgainButton = document.createElement('button');
    tryAgainButton.className = 'try-again-btn';
    tryAgainButton.textContent = 'Try Another Round';
    tryAgainButton.onclick = () => {
        const currentTopic = document.getElementById('topicSelect').value;
        createQuiz(currentTopic);
        scorePopup.remove();
    };

    scorePopupContent.appendChild(scoreDisplay);
    scorePopupContent.appendChild(tryAgainButton);
    scorePopup.appendChild(scorePopupContent);
    document.body.appendChild(scorePopup);

    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.disabled = true;
    });
}

document.getElementById('topicSelect').addEventListener('change', (e) => {
    createQuiz(e.target.value);
});
