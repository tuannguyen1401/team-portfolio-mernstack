const router = require('express').Router();

const optionsRoutes = require('./options');

router.use('/options', optionsRoutes);

module.exports = router;