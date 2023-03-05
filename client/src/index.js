import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import Welcome from './components/Welcome';
import Feature from './components/Feature'; //protect
import Signout from './components/auth/Signout';
import Signup from './components/auth/Signup';
import Signin from './components/auth/Signin';
// import BaseLayout from './components/layout/BaseLayout';
// import 'bootstrap/dist/css/bootstrap.min.css';
import {createStore, compose, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import reducer from './reducers/reducer';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import reduxThunk from 'redux-thunk'
import RequireAuth from './components/RequireAuth'
import {checkToken} from './actions'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

let store = createStore(reducer, {},  
  composeEnhancers(applyMiddleware(reduxThunk)));


store.dispatch(checkToken())

//provider hooks react to redux.  
//Must pass redux instance to provider via "store" prop.

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        {/* <BaseLayout> */}
        <Routes>
          <Route path='/' element={<App />}/>
            <Route path='/welcome' element={<Welcome />}/>
            <Route path='/signup' element={<Signup />}/>
            <Route path='/feature' element={<RequireAuth><Feature /></RequireAuth>}/>
            <Route path='/signout' element={<Signout />}/>
          <Route path='/signin' element={<Signin />}/>
        </Routes>
        {/* </BaseLayout> */}
      </Router>
    </Provider>
  </React.StrictMode>
);
