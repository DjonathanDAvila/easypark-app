describe('Navegação para Vagas', () => {
    it('deve navegar para a rota de Vagas ao clicar no botão correspondente', () => {
      // Abre a página inicial ou a página onde o AppBar está renderizado
      cy.visit('http://localhost:3000');
  
      // Aguarda a renderização do botão "Vagas" e clica nele
      cy.contains('a', 'Vagas').click();
  
      // Verifica se a URL está correta após o clique
      cy.url().should('include', '/parking_slots');
    });
  });  