const BASE_URL = "http://localhost:3000/";

describe("/ - todos feed", () => {
  it("when load, renders the page", () => {
    cy.visit(BASE_URL);
  });
  it("when create a new todo, it must appears in the screen", () => {
    // 0 - Interceptar o POST
    cy.intercept("POST", `${BASE_URL}/api/todos`, (request) => {
      request.reply({
        statusCode: 201,
        body: {
          todo: {
            id: "fe979259-2aab-44c5-8d45-f75ce190838e",
            date: "2023-12-02T02:54:50.790Z",
            content: "Test todo",
            done: false,
          },
        },
      });
    }).as("createTodo");
    // 1 - Abrir a página
    cy.visit(BASE_URL);
    // 2 - Selecionar o input de criar nova todo
    // 3 - Digitar no input de criar nova todo
    cy.get("input[name='add-todo']").type("Test todo");
    // 4 - Clicar no botão de criar nova todo
    cy.get("[aria-label='Adicionar novo item']").click();
    // 5 - Verificar se o todo criado aparece na tela
    cy.get("table > tbody").contains("Test todo");

    // Criar validações a partir de valores
    expect("texto").to.be.equal("texto");
  });
});
