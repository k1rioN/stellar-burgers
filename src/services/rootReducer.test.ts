import { rootReducer } from './rootReducer';

describe('rootReducer', () => {
  it('возвращает корректное начальное состояние при неизвестном экшене', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      ingredients: {
        ingredients: [],
        isLoading: false,
        error: null
      },
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      order: {
        orderRequest: false,
        orderModalData: null
      },
      user: {
        user: null,
        isAuthChecked: false,
        isLoading: false,
        error: null
      },
      profileOrders: {
        orders: [],
        isLoading: false,
        error: null
      },
      feed: {
        orders: [],
        total: 0,
        totalToday: 0,
        isLoading: false,
        error: null
      },
      orderInfo: {
        orderData: null,
        isLoading: false,
        error: null
      }
    });
  });
});
