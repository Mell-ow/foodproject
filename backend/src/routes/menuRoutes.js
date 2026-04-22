`const express = require('express');
const router = express.Router();
const { getAllMenuItems, getMenuItem } = require('../controllers/menuController');

router.get('/', getAllMenuItems);
router.get('/:id', getMenuItem);

module.exports = router;