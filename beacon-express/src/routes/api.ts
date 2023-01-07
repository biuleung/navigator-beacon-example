import * as express from 'express';

const router = express.Router();
router.get('/v1', (_req , res) => {
  res.json({});
});

export = router;
