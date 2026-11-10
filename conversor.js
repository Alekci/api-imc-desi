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