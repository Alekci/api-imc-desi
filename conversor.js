function converterTemperatura(valor_original) {
    const valor_convertido = (valor_original * 9 / 5) + 32
    let classificacao = "";
    if (valor_original < 80) {
        classificacao = "Temperatura ideal";
    } else if (valor_original < 95 && valor_original >= 80) {
        classificacao = "Atenção!!";
    } else if (valor_original >= 95 && valor_original <= 105) {
        classificacao = "Acima da temperatura ideal";
    } else {
        classificacao = "Limite crítico!!"
    }

    return { valor_convertido: parseFloat(valor_convertido.toFixed(2)), classificacao };
}
module.exports = converterTemperatura
