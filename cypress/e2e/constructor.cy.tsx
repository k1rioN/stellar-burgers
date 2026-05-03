import ingredientsData from '../fixtures/ingredients.json';
import orderData from '../fixtures/order.json';

const bun = ingredientsData.data.find((item) => item.type === 'bun');
const sauce = ingredientsData.data.find((item) => item.type === 'sauce');
const main = ingredientsData.data.find((item) => item.type === 'main');

if (!bun || !sauce || !main) {
  throw new Error('Не удалось подготовить моковые ингредиенты для тестов');
}

const getIngredientsSection = () =>
  cy.contains('h3', 'Булки').parents('section').first();

const getConstructorSection = () =>
  cy.contains('button', 'Оформить заказ').parents('section').first();

const addIngredient = (name: string) => {
  getIngredientsSection()
    .contains('li', name)
    .contains('button', 'Добавить')
    .click();
};

describe('Страница конструктора бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    cy.clearCookie('accessToken');
    cy.clearLocalStorage();
  });

  it('добавляет булку и начинки в конструктор', () => {
    addIngredient(bun.name);
    addIngredient(main.name);
    addIngredient(sauce.name);

    getConstructorSection().within(() => {
      cy.contains(`${bun.name} (верх)`).should('be.visible');
      cy.contains(`${bun.name} (низ)`).should('be.visible');
      cy.contains(main.name).should('be.visible');
      cy.contains(sauce.name).should('be.visible');
    });
  });

  it('открывает модальное окно ингредиента и закрывает его по крестику и оверлею', () => {
    getIngredientsSection().contains('li', main.name).find('a').click();

    cy.get('#modals').within(() => {
      cy.contains('Детали ингредиента').should('be.visible');
      cy.contains(main.name).should('be.visible');
      cy.contains(String(main.calories)).should('be.visible');
    });

    cy.get('#modals').find('button').click();
    cy.get('#modals').children().should('have.length', 0);

    getIngredientsSection().contains('li', sauce.name).find('a').click();

    cy.get('#modals').within(() => {
      cy.contains('Детали ингредиента').should('be.visible');
      cy.contains(sauce.name).should('be.visible');
      cy.contains(String(sauce.proteins)).should('be.visible');
    });

    cy.get('#modals').children().last().click({ force: true });
    cy.get('#modals').children().should('have.length', 0);
  });

  it('создает заказ, показывает номер и очищает конструктор', () => {
    cy.window().then((window) => {
      window.localStorage.setItem('refreshToken', 'test-refresh-token');
    });
    cy.setCookie('accessToken', 'test-access-token');
    cy.reload();

    cy.wait('@getIngredients');
    cy.wait('@getUser');

    addIngredient(bun.name);
    addIngredient(main.name);
    addIngredient(sauce.name);

    cy.contains('button', 'Оформить заказ').click();
    cy.wait('@createOrder');

    cy.get('#modals').within(() => {
      cy.contains(String(orderData.order.number)).should('be.visible');
    });

    cy.get('#modals').find('button').click();
    cy.get('#modals').children().should('have.length', 0);

    getConstructorSection().within(() => {
      cy.contains('Выберите булки').should('be.visible');
      cy.contains('Выберите начинку').should('be.visible');
    });
  });
});
