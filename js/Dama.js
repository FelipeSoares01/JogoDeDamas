class Dama {
    constructor(linha, coluna) {
        this.linha = linha;
        this.coluna = coluna;
    }

    comparar(dama) {
        return dama.linha === this.linha && dama.coluna === this.coluna;
    }
}
export default Dama;