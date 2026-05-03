import reducer, { fetchIngredients } from './ingredientsSlice';
import { TIngredient } from '../../utils/types';

const ingredients: TIngredient[] = [
  {
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
  },
  {
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
  }
];

describe('ingredientsSlice', () => {
  it('устанавливает isLoading в true при начале запроса', () => {
    const state = reducer(
      undefined,
      fetchIngredients.pending('requestId', undefined)
    );

    expect(state).toEqual({
      ingredients: [],
      isLoading: true,
      error: null
    });
  });

  it('сохраняет ингредиенты и завершает загрузку при успешном запросе', () => {
    const state = reducer(
      {
        ingredients: [],
        isLoading: true,
        error: 'Предыдущая ошибка'
      },
      fetchIngredients.fulfilled(ingredients, 'requestId', undefined)
    );

    expect(state).toEqual({
      ingredients,
      isLoading: false,
      error: null
    });
  });

  it('сохраняет ошибку и завершает загрузку при ошибке запроса', () => {
    const state = reducer(
      {
        ingredients,
        isLoading: true,
        error: null
      },
      fetchIngredients.rejected(new Error('Ошибка загрузки'), 'requestId')
    );

    expect(state.ingredients).toEqual(ingredients);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
  });
});
