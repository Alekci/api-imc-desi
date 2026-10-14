const calcularIMC = require('./imc');
describe('Validador de IMC',()=>{
    test('Teste de abaixo do peso',()=>{
        const resultado=calcularIMC(52.00,1.75);
        expect(resultado).toEqual({
            imc:16.98,
            status:'Abaixo do peso normal'
        });
    });
    test('Teste de peso normal',()=>{});
    test('Teste de excesso de Peso',()=>{});
    test('Teste de obesidade',()=>{});
});