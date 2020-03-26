var assert = require('assert');
const ServiceManager = require('../services/ServiceManager.js');
const serviceManager = new ServiceManager()

function signUpUser(callback) {
  serviceManager.GetUserAccountService().SignUp("test","12345",(succeed, error) => {
    assert.equal(succeed, true);
    serviceManager.GetUserAccountService().GetUser("test",(user) => {
      assert.equal(user.username, "test");
      callback()
    })
  });
}
function loginUser(callback) {
  serviceManager.GetUserAccountService().Login("test","12345",(succeed, error) => {
    assert.equal(error, null);
    serviceManager.GetUserAccountService().Login("test","123445",(succeed, error) => {
      assert.equal(succeed, false);
      callback()
    })
  });
}

describe("User Account tests", function() {
  before(function(done) {
    // services.sqlService.sqlInterface.config.database = "test"
    serviceManager.sqlService.sqlInterface.ClearDB(() => {
      console.log("cleared")  
      done()
    });
  });
  describe('CreateUser', function() {
    it('Sign up should be successfull', function(done) {
      signUpUser(() => {
        done();
      })
    })
  });
  describe('Log In User', function() {
    it('Log in should be successfull', function(done) {
      loginUser(() => {
        done();
      })
    })
  });
  after((done) => {
    if (serviceManager.sqlService.sqlInterface.pool != undefined ) {
      serviceManager.sqlService.sqlInterface.pool.close()
      serviceManager.sqlService.sqlInterface.pool = undefined
    }
    done()
  })
})
