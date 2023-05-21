'use strict';

const { check } = require('express-validator');

module.exports = {
   rules: [
      check('message')
         .not().isEmpty()
   ]
};
