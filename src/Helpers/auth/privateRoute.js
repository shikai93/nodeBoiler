import React from 'react';
import { Route } from 'react-router-dom';
import { useAuth } from "./auth.js";
import { Redirect } from 'react-router'
function PrivateRoute({ component: Component, ...rest }) {
    const isAuthenticated = useAuth();
    return(
        <Route {...rest} render={(props) => (
            isAuthenticated.isAuthenticated ? (
                <Component {...props} />
            ) : (
                <Redirect to={{
                    pathname: "/login",
                    state: { referrer: window.location.pathname }
                  }} />
            )
        )}
        />
    );
}

export default PrivateRoute;