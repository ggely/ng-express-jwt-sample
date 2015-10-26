# Weather Application

Weather Application is a sample of application which contains the basis of the user management and authentication with a JWT token.
The application use Express, Passport and Mongoose and Angular
The authentication use a local strategy to create the token, put it could be easily extends by using Passport strategy.
The client is based on Angular, but a new version will coming soon (I hope) with the awesome framework  [Aurelia](http://aurelia.io/)  and the plugin [aurelia-auth](https://github.com/paulvanbladel/aurelia-auth).
 

## Requirements

* [NodeJs](http://nodejs.org)
* [mongodb](http://mongodb.org)
* [Grunt](http://http://gruntjs.com/)

## Install
$ npm install
$ bower install

## Run in development
$ grunt serve

connect in localhost:3000

## Deploy in production
$ grunt build
$ node . MONGODB_URL=url_of_mongo TOKEN=MySecretToken

## Tests
To test the server:
$ grunt mochaTest

To test the front end run karma
