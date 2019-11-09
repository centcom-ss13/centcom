import React from 'react';
import RootContainer from "./rootContainer";
import configureStore, {history} from './store';
import {Provider} from "react-redux";
import {ConnectedRouter} from "connected-react-router";
import HealthPing from "./modules/healthPing"

const store = configureStore({});

export default class Main extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <HealthPing />
          <div id="app">
            <RootContainer/>
          </div>
        </ConnectedRouter>
      </Provider>
    );
  }
}