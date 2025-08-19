const express = require('express');
const router = express.Router();

router.get('/articles', (req, res) => {
  res.send('Articles list');
});

router.post('/articles', (req, res) => {
  res.send('Article created');
});

module.exports = router;