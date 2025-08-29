const router = require('express').Router();

const optionsRoutes = require('./options');
const projectsRoutes = require('./projects');

router.use('/options', optionsRoutes);
router.use('/projects', projectsRoutes);


module.exports = router;