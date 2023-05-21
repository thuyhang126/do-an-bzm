'use strict';

const { body } = require('express-validator');

module.exports = {
   rules: [
      body('email')
         .isEmail(),

      body('password')
         .not().isEmpty()
   ]
};
