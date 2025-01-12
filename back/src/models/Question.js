class Question{
    constructor(question, answer, choices, correct){
        this.question = question;
        this.answer = answer;
        this.choices = choices;
        this.correct = correct;
    }

    getQuestion(){
        return this.question;
    }

    getAnswer(){
        return this.answer;
    }

    getCorrect(){
        return this.choices[this.correct];
    }
}

module.exports = Question;