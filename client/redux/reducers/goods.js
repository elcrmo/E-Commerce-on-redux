import axios from 'axios'

const GET_GOODS = 'GET_GOODS'
const GET_CURRENCY = 'GET_CURRENCY'
export const SET_CURRENT_RATE = 'SET_CURRENT_RATE'
export const GET_SORTED_GOODS = 'GET_SORTED_GOODS'

const initialState = {
  list: [],
  rates: {},
  currentRate: 1,
  currency: 'USD'
}

const getImage = (products) => {
  return products.map((it) => ({
    ...it,
    image: `https://source.unsplash.com/800x600/?${/\w+(?=\s)/gi.exec(it.title)}`
  }))
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_GOODS:
    case GET_SORTED_GOODS: {
      const { list } = action
      return {
        ...state,
        list: getImage(list)
      }
    }
    case GET_CURRENCY: {
      const { rates } = action
      return {
        ...state,
        rates
      }
    }
    case SET_CURRENT_RATE: {
      const { currency, symbol } = action.current
      return {
        ...state,
        currentRate: currency,
        currency: symbol
      }
    }
    default:
      return state
  }
}

export function getGoods() {
  return (dispatch) => {
    axios('/api/v1/data')
      .then(({ data: list }) => dispatch({ type: GET_GOODS, list }))
      .catch(() => dispatch({ type: GET_GOODS, list: [] }))
  }
}

export function getCurrency() {
  return (dispatch) => {
    axios('/api/v1/rates')
      .then(({ data: rates }) => dispatch({ type: GET_CURRENCY, rates }))
      .catch(() => dispatch({ type: GET_CURRENCY, rates: {} }))
  }
}

export function setCurrentRate(currencyType) {
  return (dispatch, getState) => {
    const store = getState()
    const { rates, currency } = store.goods
    dispatch({
      type: SET_CURRENT_RATE,
      current: { currency: rates[currencyType], symbol: currencyType, previousCurrency: currency }
    })
  }
}

export function sort(str) {
  return (dispatch, getState) => {
    const store = getState()
    const { list } = store.goods
    const typeOfSort = JSON.parse(str)
    const sortedList = [...list].sort(
      (a, b) =>
        (typeOfSort.type === 'price' ? a.price - b.price : a.title.localeCompare(b.title)) *
        typeOfSort.order
    )
    dispatch({
      type: GET_SORTED_GOODS,
      list: sortedList,
      sortType: typeOfSort.type
    })
  }
}
