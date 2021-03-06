import React from 'react';
import {
      BrowserRouter as Router,
      Route,
      Redirect,
      Switch
    } from 'react-router-dom';

import DefaultPage from '../root/DefaultPage.jsx';
import { initServiceWorker } from '../scripts/serviceWorker.js';
import { initDb } from '../scripts/indexedDb.js';
import Dashboard from '../pages/Dashboard.js';
import './BaseStyle.less';

export default class App extends React.Component {
    constructor(props) {
        super();
    }

    componentDidMount() {
        this.props.initial_meals();
        initDb('food', 'userData')
            .then(db => db.get('user'))
            .then(user => this.props.initial_user(user))
            .catch(console.log);

        initServiceWorker()
            .then(subscription => {
                this.props.connect_serviceworker(subscription);
            })
    }

    render() {
        return (<Router>
            <Switch>
                <Route path="/unsubscribe" render={({location}) => <DefaultPage app={this.props.app} dialog={Object.assign({type: "UNSUBSCRIBE", location: location, user: this.props.user}, this.props.app.dialog)}><Dashboard/></DefaultPage>} />
                <Route path="/subscribe" render={({location}) => <DefaultPage app={this.props.app} dialog={Object.assign({type: "SUBSCRIBE", location: location}, this.props.app.dialog)}><Dashboard/></DefaultPage>} />
                <Route exact path="/" render={() => <DefaultPage app={this.props.app} dialog={this.props.app.dialog}><Dashboard/></DefaultPage>} />
                <Redirect to="/" />
            </Switch>
        </Router>)
    }
}