## OttoDot

Web Application to allow students to learn in a fun and social manner

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `cd Server`
### `node server.js`
Runs backend server to allow react frontend to function and facilitate connection to SQL<br />
Config file must be updated with SQL credentials to enable backend services to work<br /><br />

## Routes 
All routes are defined in routes/index.js<br />
# /login
``` 
{
    "username" : String,
    "password" :  String
}
```
Logs user into the system and returns an authorization token to be used for subsequent calls
# /signup
``` 
{
    "username" : String,
    "password" :  String
}
```
Creates user in the system

## Security
All API calls would require a jwt token in the authorization header which can be obtained by calling the route /login with the right credentials <br />
Tokens last for 1 day and would require relog in to regenerate a new token. Refresh token function can be done sometime in the future

### `npm test`

Launches the test runner in the interactive watch mode.<br />
