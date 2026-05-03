import reducer, {
  addIngredient,
  moveIngredientDown,
  moveIngredientUp,
  removeIngredient
} from './burgerConstructorSlice';
import { TConstructorIngredient, TIngredient } from '../../utils/types';

const bun: TIngredient = {
  _id: 'bun-1',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'test-bun.png',
  image_large: 'test-bun-large.png',
  image_mobile: 'test-bun-mobile.png'
};

const mainIngredient: TIngredient = {
  _id: 'main-1',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'test-main.png',
  image_large: 'test-main-large.png',
  image_mobile: 'test-main-mobile.png'
};

const sauceIngredient: TIngredient = {
  _id: 'sauce-1',
  name: 'Соус Space Sauce',
  type: 'sauce',
  proteins: 50,
  fat: 22,
  carbohydrates: 11,
  calories: 14,
  price: 80,
  image: 'test-sauce.png',
  image_large: 'test-sauce-large.png',
  image_mobile: 'test-sauce-mobile.png'
};

describe('burgerConstructorSlice', () => {
  it('добавляет булку в конструктор', () => {
    const state = reducer(undefined, addIngredient(bun));

    expect(state.bun).toEqual(bun);
    expect(state.ingredients).toEqual([]);
  });

  it('добавляет начинку в конструктор', () => {
    const state = reducer(undefined, addIngredient(mainIngredient));

    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual({
      ...mainIngredient,
      id: expect.any(String)
    });
  });

  it('удаляет ингредиент из конструктора', () => {
    const state = reducer(
      {
        bun: null,
        ingredients: [
          { ...mainIngredient, id: 'main-id' },
          { ...sauceIngredient, id: 'sauce-id' }
        ]
      },
      removeIngredient('main-id')
    );

    expect(state.ingredients).toEqual([
      { ...sauceIngredient, id: 'sauce-id' }
    ]);
  });

  it('перемещает ингредиент вверх', () => {
    const state = reducer(
      {
        bun: null,
        ingredients: [
          { ...mainIngredient, id: 'main-id' },
          { ...sauceIngredient, id: 'sauce-id' }
        ] as TConstructorIngredient[]
      },
      moveIngredientUp(1)
    );

    expect(state.ingredients).toEqual([
      { ...sauceIngredient, id: 'sauce-id' },
      { ...mainIngredient, id: 'main-id' }
    ]);
  });

  it('перемещает ингредиент вниз', () => {
    const state = reducer(
      {
        bun: null,
        ingredients: [
          { ...mainIngredient, id: 'main-id' },
          { ...sauceIngredient, id: 'sauce-id' }
        ] as TConstructorIngredient[]
      },
      moveIngredientDown(0)
    );

    expect(state.ingredients).toEqual([
      { ...sauceIngredient, id: 'sauce-id' },
      { ...mainIngredient, id: 'main-id' }
    ]);
  });
});
