import express, { Response } from "express";
import auth from "../middleware/auth";
import User from "../models/User";
import Video from "../models/Video";

const router = express.Router();

// Add video to watch later
router.post("/:videoId", auth(["viewer"]), async (req: any, res: Response) => {
  try {
    const video = await Video.findById(req.params.videoId);
    if (!video) return res.status(404).json({ msg: "Video not found" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (!user.watchLater.includes(req.params.videoId)) {
      user.watchLater.push(req.params.videoId);
      await user.save();
    }

    res.json({ msg: "Video added to Watch Later" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Remove video from watch later
router.delete("/:videoId", auth, async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.watchLater = user.watchLater.filter(
      (videoId) => videoId.toString() !== req.params.videoId
    );
    await user.save();

    res.json({ msg: "Video removed from Watch Later" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Get watch later videos
router.get("/", auth(["viewer"]), async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "watchLater",
      populate: { path: "creator", select: "email" },
    });
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user.watchLater);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
