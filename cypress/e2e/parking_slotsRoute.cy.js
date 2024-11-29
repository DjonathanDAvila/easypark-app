describe("Navegação e Verificação de Vagas", () => {
  it("deve navegar para a rota de Vagas, carregar e exibir as vagas corretamente", () => {
    cy.intercept("GET", "/api/parking_slots", {
      statusCode: 200,
      body: {
        vehicles: [
          { id: 1, slot_number: "A1", status: "AVAILABLE" },
          { id: 2, slot_number: "B2", status: "OCCUPIED" },
        ],
      },
    }).as("getParkingSlots");

    cy.visit("http://localhost:3000");
    cy.contains("a", "Vagas").click();

    cy.wait("@getParkingSlots");

    cy.url().should("include", "parking_slots");

    cy.get("table").within(() => {
      cy.contains("th", "ID");
      cy.contains("td", "1");
      cy.contains("td", "A1");
      cy.contains("td", "AVAILABLE");
    });
  });
});
