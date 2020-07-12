import React, { useState, useEffect } from "react"
import Model from "../../Models/Model.js"
const AuthContext = React.createContext()
function AuthProvider(props) {
    const [user, setUser] = useState({});
    useEffect(() => { 
        const api = new Model();
        api.postReq('/token/verify',{},(values) =>{
            if (values === null) {
                user.isAuthenticated = false
                setUser(user)
                return
            }
            if (values.success) {
                var newUser = values.value
                newUser.isAuthenticated = true
                setUser(newUser)
            } else {
                setUser({
                    isAuthenticated : false
                })
            }
        })
    }, user.isAuthenticated)

    return (
        <AuthContext.Provider value={{user, setUser}} {...props} >
            {props.children}
        </AuthContext.Provider>
    )
}
function authenticate(username, password, authManager, callback) {
    const api = new Model();
    api.postReq('/login',{
        username: username,
        password : password
    },(values,err) => {
        if (values.success) {
            const val = values.value
            localStorage.setItem("userId",val.userId)
            api.postReq('/token/verify',{
                token : val.token
            },(values) =>{
                if (values === null) {
                    callback(false)
                    return
                }
                if (values.success) {
                    var newUser = values.value
                    newUser.isAuthenticated = true
                    authManager.setUser(newUser)
                } else {
                    authManager.setUser({
                        isAuthenticated : false
                    })
                }
                callback(values.success)
            })
        } else {
            authManager.setUser({
                isAuthenticated : false
            })
            callback(values.success)
        }
    })
}
function logout(authManager) {
    localStorage.removeItem('userId');
    authManager.setUser({
        isAuthenticated : false
    })
}
const useAuth = () => React.useContext(AuthContext)

function withAuth(Component) {
    const C = props => {
      const { wrappedComponentRef, ...remainingProps } = props;
      return (
        <AuthContext.Consumer>
          {(user,setUser) => {
                return (
                <Component
                    {...remainingProps}
                    {...user, setUser}
                    user = {user}
                    ref={wrappedComponentRef}
                />
                );
          }}
        </AuthContext.Consumer>
      );
    };
    C.WrappedComponent = Component;
    return C;
}
  
export {AuthProvider, useAuth, AuthContext, authenticate, logout, withAuth}