# Weather Application

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

To test the front end
