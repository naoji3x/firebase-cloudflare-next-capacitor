'use client'
import { StatusBar, Style } from '@capacitor/status-bar'
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import { Route } from 'react-router-dom'

import Tabs from './pages/Tabs'

setupIonicReact({})

window
  .matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', async (status) => {
    try {
      await StatusBar.setStyle({
        style: status.matches ? Style.Dark : Style.Light
      })
    } catch {
      console.error('Failed to set status bar style')
    }
  })

const AppShell = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet id="main">
          <Route path="/" render={() => <Tabs />} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  )
}

export default AppShell
