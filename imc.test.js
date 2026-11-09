const calcularIMC = require('./imc');

describe('Validador de IMC', () => {
    test('Teste de abaixo do peso normal', () => {
        const resultado = calcularIMC(52, 1.75);
        expect(resultado).toEqual({
            imc: 16.98,
            status: 'Abaixo do peso normal'
        });
    });
    test('Teste de peso normal', () => {
        const resultado = calcularIMC(58, 1.60);
        expect(resultado).toEqual({
            imc: 22.66,
            status: 'Peso normal'
        });
    });
    test('Teste de excesso de peso', () => {
          const resultado = calcularIMC(73, 1.62);
        expect(resultado).toEqual({
            imc: 27.82,
            status: 'Excesso de Peso'
        });
    });
    test('Teste de obesidade', () => {
        const resultado = calcularIMC(105, 1.72);
        expect(resultado).toEqual({
            imc: 35.49,
            status: 'Obesidade'
        });
    });
});