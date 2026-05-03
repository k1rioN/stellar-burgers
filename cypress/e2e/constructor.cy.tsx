import ingredientsData from '../fixtures/ingredients.json';
import orderData from '../fixtures/order.json';

const SELECTORS = {
  ingredientSectionTitle: 'Булки',
  ingredientItem: 'li',
  ingredientLink: 'a',
  button: 'button',
  modals: '#modals'
} as const;

const TEXT = {
  addButton: 'Добавить',
  constructorButton: 'Оформить заказ',
  ingredientDetailsTitle: 'Детали ингредиента',
  emptyBuns: 'Выберите булки',
  emptyFillings: 'Выберите начинку'
} as const;

const bun = ingredientsData.data.find((item) => item.type === 'bun');
const sauce = ingredientsData.data.find((item) => item.type === 'sauce');
const main = ingredientsData.data.find((item) => item.type === 'main');

if (!bun || !sauce || !main) {
  throw new Error('Не удалось подготовить моковые ингредиенты для тестов');
}

const getIngredientsSection = () =>
  cy.contains('h3', SELECTORS.ingredientSectionTitle).parents('section').first();

const getConstructorSection = () =>
  cy.contains(SELECTORS.button, TEXT.constructorButton)
    .parents('section')
    .first();

const getModal = () => cy.get(SELECTORS.modals);

const assertModalClosed = () =>
  getModal().children().should('have.length', 0);

const closeModalByButton = () =>
  getModal().find(SELECTORS.button).click();

const closeModalByOverlay = () =>
  getModal().children().last().click({ force: true });

const openIngredientModal = (name: string) => {
  getIngredientsSection()
    .contains(SELECTORS.ingredientItem, name)
    .find(SELECTORS.ingredientLink)
    .click();
};

const addIngredient = (name: string) => {
  getIngredientsSection()
    .contains(SELECTORS.ingredientItem, name)
    .contains(SELECTORS.button, TEXT.addButton)
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
    openIngredientModal(main.name);

    getModal().within(() => {
      cy.contains(TEXT.ingredientDetailsTitle).should('be.visible');
      cy.contains(main.name).should('be.visible');
      cy.contains(String(main.calories)).should('be.visible');
    });

    closeModalByButton();
    assertModalClosed();

    openIngredientModal(sauce.name);

    getModal().within(() => {
      cy.contains(TEXT.ingredientDetailsTitle).should('be.visible');
      cy.contains(sauce.name).should('be.visible');
      cy.contains(String(sauce.proteins)).should('be.visible');
    });

    closeModalByOverlay();
    assertModalClosed();
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

    cy.contains(SELECTORS.button, TEXT.constructorButton).click();
    cy.wait('@createOrder');

    getModal().within(() => {
      cy.contains(String(orderData.order.number)).should('be.visible');
    });

    closeModalByButton();
    assertModalClosed();

    getConstructorSection().within(() => {
      cy.contains(TEXT.emptyBuns).should('be.visible');
      cy.contains(TEXT.emptyFillings).should('be.visible');
    });
  });
});
