import * as express from 'express';

const router = express.Router();
// 服務初始化的部分
router.get('/', (_req , res) => {
  return res.render('home');
});
router.post('/', (_req , res) => {
  console.log("incoming beacon: ", _req.body)
  return res.json({post: 'post/'})
});
export = router;
