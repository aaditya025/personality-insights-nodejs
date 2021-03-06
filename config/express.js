/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

// Module dependencies
var express  = require('express'),
  bodyParser = require('body-parser'),
  session    = require('./session'),
  cookieParser = require('cookie-parser'),
  logger     = require('winston'),
  morgan     = require('morgan'),
  i18n       = require('i18n'),
  appInfo = require('./app-info');

module.exports = function (app) {

  app.set('view engine', 'ejs');
  require('ejs').delimiter = '$';
  app.enable('trust proxy');
  app.use(morgan('dev'));

  // Configure Express
  app.use(bodyParser.urlencoded({ extended: true, limit: '15mb' }));
  app.use(bodyParser.json({ limit: '15mb' }));
  app.use(express.static(__dirname + '/../public'));


  var secret = Math.random().toString(36).substring(7);

  app.use(cookieParser(secret));
  app.use(session({ secret: secret, signed: false }));

  require('./i18n')(app);

  // When running in Bluemix add rate-limitation
  // and some other features around security
  if (appInfo.secure)
    require('./security')(app);

  require('./passport')(app);


};
