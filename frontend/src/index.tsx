import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { store } from './store';

import './styles/flowcharts.less';
import './styles/mixins.less';
import './styles/normalize.less';
import './styles/style.less';
import './styles/variables.less';

import * as serviceWorker from './serviceWorker';
import { App } from './App';

ReactDOM.render((
    <Provider store={store}>
        <App />
    </Provider>
), document.getElementById('root'));

serviceWorker.register();
