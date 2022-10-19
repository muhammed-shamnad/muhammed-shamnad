  const express = require('express');
  const router = express.Router();

  const s3HandlingRoutes = require('./s3-Handling-Routes')

  router.use('/s3', s3HandlingRoutes);
  
  module.exports = router;
