import React, { Fragment } from 'react';
import { Container } from 'semantic-ui-react'
import './styles.css';
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import { Route, withRouter, RouteComponentProps, Switch } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import NotFound from '../../app/layout/NotFound';
import { ToastContainer } from 'react-toastify';

const App: React.FC<RouteComponentProps> = ({ location }) => {

    return (
        <Fragment>
            <ToastContainer position='bottom-right' />
            <Route exact path='/' component={HomePage} />
            <Route path={'/(.+)'} render={() => (
                <Fragment>
                    <NavBar />
                    <Container style={{ marginTop: '7em' }}>
                        <Switch>
                            <Route exact path='/activities' component={ActivityDashboard} />
                            <Route path='/activities/:id' component={ActivityDetails} />
                            <Route key={location.key} path={['/createActivity', '/manage/:id']} component={ActivityForm} />
                            <Route component={NotFound} /> 
                        </Switch>
                    </Container>
                </Fragment>
            )} />
        </Fragment>
    );
}

// a <Route/> that isn't hit defaults such as the one above <Route component={NotFound} />. Because there are no paths it will be the one that gets hit

// withRouter wires up the app with routing properties accessible via RouteComponentProps
export default withRouter(observer(App));