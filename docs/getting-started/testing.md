# Testing

> The example is done with [Mocha](https://mochajs.org) and [Chai](http://chaijs.com/api/bdd). If you don't want to use those libraries, you
> can choose to create your tests however you want.

Although last in this tutorial, a testable application is crucial for enterprise software and Steeplejack makes this really easy. If you follow
the [SOLID Principles](https://en.wikipedia.org/wiki/SOLID_%28object-oriented_design%29), you won't go far wrong.

You can look through all the tests in the [Steeplejack example](https://github.com/riggerthegeek/steeplejack-example) project. To show how
easy it can be, let's take a look at the `$userService` and how we can test it.

## /test/unit/modules/service.test.js

Notice how we have a `beforeEach` function that defines the instance of the `$userService`. By defining the dependencies we want to rely
upon, this is largely how the dependency injector works underneath. It also means we can easily stub the dependencies so we can test how
each unit of code behaves.

```javascript
import {ValidationException} from "steeplejack/exception/validation";
import {expect, sinon} from "../../../helpers/config";
import {User} from "../../../../src/modules/user/model/User";
import {UserService} from "../../../../src/modules/user/service";

describe("UserService test", function () {

    beforeEach(function () {

        this.userStore = {
            getUserByEmailAddress: sinon.stub()
        };

        this.$userService = new UserService(User, this.userStore);

    });

    describe("methods", function () {

        it("should throw an error when no emailAddress", function () {

            let fail = false;

            try {
                this.$userService.getUserByEmailAddress();
            } catch (err) {
                fail = true;

                expect(err).to.be.instanceof(ValidationException);
                expect(err.message).to.be.equal("emailAddress is required");
            } finally {
                expect(fail).to.be.true;
            }

        });

        it("should throw an error when invalid emailAddress", function () {

            let fail = false;

            try {
                this.$userService.getUserByEmailAddress("not an email");
            } catch (err) {
                fail = true;

                expect(err).to.be.instanceof(ValidationException);
                expect(err.message).to.be.equal("emailAddress is required");
            } finally {
                expect(fail).to.be.true;
            }

        });

        it("should return undefined if nothing found", function () {

            this.userStore.getUserByEmailAddress.resolves(null);

            return this.$userService.getUserByEmailAddress("test@test.com")
                .then(result => {

                    expect(result).to.be.undefined;

                    expect(this.userStore.getUserByEmailAddress).to.be.calledOnce
                        .calledWithExactly("test@test.com");

                });

        });

        it("should return UserModel if data found", function () {

            this.userStore.getUserByEmailAddress.resolves({
                id: 1234,
                firstName: "Barry",
                lastName: "Scott",
                emailAddress: "barry@cillitbang.com"
            });

            return this.$userService.getUserByEmailAddress("barry@cillitbang.com")
                .then(result => {

                    expect(result).to.be.instanceof(User);

                    expect(result.getData()).to.be.eql({
                        id: 1234,
                        firstName: "Barry",
                        lastName: "Scott",
                        emailAddress: "barry@cillitbang.com"
                    });

                    expect(this.userStore.getUserByEmailAddress).to.be.calledOnce
                        .calledWithExactly("barry@cillitbang.com");

                });

        });

    });

});
```

In fewer than 100 lines of code, we have achieved 100% code coverage on the `$userService`. By following these principles, you can easily
achieve 100% code coverage throughout your entire application.

The `User` model we have used is the concrete class which has been used to simplify things in this example. We could just as easily have
created a stubbed class so we're testing the interface only - indeed, this would be better in a production application.
