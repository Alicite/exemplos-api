const fetchTrivia = async (endpoint='', qtd=5) => {
    try {
        const url = `https://opentdb.com/api.php?amount=${qtd}${endpoint}`
        let resultado = await fetch(url);
        resultado = await resultado.json();

        return resultado.results;
    } catch (e) {
        console.error(e.message)
    }
};

const fetchTradutor = async (texto) => {
    try {
        const url = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=auto&tl=pt-BR&q=${encodeURIComponent(texto)}`;
        let resultado = await fetch(url);
        resultado = await resultado.json();

        return resultado[0][0];
    } catch (e) {
        console.error(e.message);
    }
}

const mostrarQuestoes = async () => {
    const container = document.querySelector('#question-container');
    const questions = await fetchTrivia();
    container.innerHTML = '';

    questions.forEach(async (question) => {
        const novaQuestao = document.createElement('div');
        novaQuestao.classList.add('question');
        
        const respostas = [...question.incorrect_answers, question.correct_answer];
        respostas.sort((a, b) => {
            if (Math.random() < 0.5){
                return a - b
            } else {
                return b - a
            }
        })
        novaQuestao.innerHTML = decodeURIComponent(await fetchTradutor(question.question)) + '<br>';

        respostas.forEach(async (resposta) => {
            const botaoResposta = document.createElement('button');
            botaoResposta.innerText = decodeURIComponent(await fetchTradutor(resposta));

            botaoResposta.onclick = async () => {
                if (botaoResposta.innerText == await fetchTradutor(question.correct_answer)){
                    botaoResposta.style.backgroundColor = 'green';
                } else {
                    botaoResposta.style.backgroundColor = 'red';
                }
            }

            novaQuestao.appendChild(botaoResposta);
        })
        
        container.appendChild(novaQuestao);
    });
}

mostrarQuestoes();