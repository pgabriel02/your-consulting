module.exports = app => {
    'use strict';
    const express         = require('express');
    const jonctiuneCtrl = require('../controllers/jonctiuneCtrl')(app.locals.db);
    const router          = express.Router();
  
    router.post('/', jonctiuneCtrl.create);
    router.put('/', jonctiuneCtrl.update);
    router.get('/:id', jonctiuneCtrl.find);
    router.delete('/:id/:car', jonctiuneCtrl.destroy);
  
    return router;
  };
  