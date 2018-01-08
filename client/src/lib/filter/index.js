import Filter from './filter'

export default function filter(name, strategy) {
  return function(dispatch, getState) {
    return new Filter({
      name,
      strategy,
      dispatch,
      getState
    })
  }
}

export * from './reducer'
export * from './filterStrategy'
