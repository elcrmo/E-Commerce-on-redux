const ADD_ID = 'ADD_ID'

const initialState = {
  listOfIds: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_ID: {
      return { ...state, listOfIds: action.listOfIds }
    }
    default:
      return state
  }
}

export function addId(id, number = 1) {
  return (dispatch, getState) => {
    const store = getState()
    const { listOfIds } = store.basket
    let isElementFound = false
    let newListOfIds = listOfIds.reduce((acc, rec) => {
      if (rec.id === id) {
        isElementFound = true
        const newQuantity = Math.max(rec.quantity + number, 0)
        if (newQuantity > 0) {
          return [...acc, { id: rec.id, quantity: newQuantity }]
        }
        return [...acc]
      }
      return [...acc, rec]
    }, [])

    if (!isElementFound) {
      newListOfIds = [...newListOfIds, { id, quantity: 1 }]
    }
    dispatch({
      type: ADD_ID,
      listOfIds: newListOfIds
    })
  }
}
