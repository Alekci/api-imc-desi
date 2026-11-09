function calcularDolar(valorReal, cotacao) {
    const dolar = valorReal / cotacao;
    return {dolar: parseFloat(dolar.toFixed(2)) };
}
module.exports = calcularDolar;