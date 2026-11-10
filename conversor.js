<<<<<<< HEAD
function converterTemperatura(valorOriginal) {
    const valorConvertido = (valorOriginal * 9 / 5) + 32
    let classificacao = "";
    if (valorOriginal < 80) {
        classificacao = "Temperatura ideal";
    } else if (valorOriginal < 95 && valorOriginal >= 80) {
        classificacao = "Atenção!!";
    } else if (valorOriginal >= 95 && valorOriginal <= 105) {
        classificacao = "Acima da temperatura ideal";
    } else {
        classificacao = "Limite crítico!!"
    }

    return { valorConvertido: parseFloat(valorConvertido.toFixed(2)), classificacao };
}
module.exports = converterTemperatura
=======
function calcularDolar(valorReal, cotacao) {
    const dolar = valorReal / cotacao;
    return {dolar: parseFloat(dolar.toFixed(2)) };
}
module.exports = calcularDolar;
>>>>>>> 8170ae3fb144b6d46f0995b3aada3528e708551b
