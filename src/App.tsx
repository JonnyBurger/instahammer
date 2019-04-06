import React from 'react'
import { createStackNavigator, createAppContainer } from 'react-navigation'
import { Provider } from 'react-redux'

import { Explore } from './Explore'
import Camera from './Camera'
import { configureStore } from './redux'

const Navigator = createAppContainer(
  createStackNavigator(
    {
      Camera,
      Explore,
    },
    {
      initialRouteName: 'Explore',
    },
  ),
)

// Store
const store = configureStore()

export class Entry extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Navigator />
      </Provider>
    )
  }
}

export default Entry
