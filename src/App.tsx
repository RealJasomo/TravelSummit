import React, { Component } from 'react'

import { AppBar, Toolbar, IconButton, Typography } from '@material-ui/core'
import { Home, CurrencyContextProvider, MarketContextProvider } from './components'

import MenuIcon from '@material-ui/icons/Menu'

export default class App extends Component {
  render() {
    return (
      <MarketContextProvider>
        <CurrencyContextProvider>
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6">
              Travel Tracker
            </Typography>
          </Toolbar>
        </AppBar>
        <Home />
        </CurrencyContextProvider>
      </MarketContextProvider>
    )
  }
}
