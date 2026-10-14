//Função para calcular o IMC
function calcularIMC(peso, altura) {
    const resultado = peso / (altura * altura);
    const imc = parseFloat(resultado.toFixed(2));
    let status = "";
    if (imc < 18.5) {
        status = "Abaixo do peso normal";
    } else if (imc < 25) {
        status = "Peso normal";
    } else if (imc < 30) {
        status = "Excesso de Peso";
    } else {
        status = "Obesidade";
    }
    return { imc, status };
}
module.exports = calcularIMC;