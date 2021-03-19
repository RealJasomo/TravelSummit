import React, { Component } from 'react'

import { AppBar, Toolbar,  Typography } from '@material-ui/core'
import { Home, CurrencyContextProvider, MarketContextProvider } from './components'

import styles from './css/app.module.css'

export default class App extends Component {
  render() {
    return (
      <MarketContextProvider>
        <CurrencyContextProvider>
        <AppBar position="static" className={styles.appBar}>
          <Toolbar>
            <Typography variant="h6">
              Flight Tracker
            </Typography>
          </Toolbar>
        </AppBar>
        <Home />
        </CurrencyContextProvider>
      </MarketContextProvider>
    )
  }
}
