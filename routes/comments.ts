import express, { Request, Response } from 'express';
import auth from '../middleware/auth';
import Comment from '../models/Comment';

const router = express.Router();

interface CommentRequest extends Request {
  user?: { id: string; role: string };
  body: { video: string; content: string };
}

router.post('/', auth(['viewer']), async (req: CommentRequest, res: Response) => {
  const { video, content } = req.body;
  try {
    const comment = new Comment({ video, content });
    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/:videoId', async (req: Request, res: Response) => {
  try {
    const comments = await Comment.find({ video: req.params.videoId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;