import express, { Request, Response } from "express";
import auth from "../middleware/auth";
import Video from "../models/Video";

const router = express.Router();

interface VideoRequest extends Request {
  user?: { id: string; role: string };
  body: {
    title: string;
    description: string;
    embedLink: string;
    tags: string[];
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    category: string;
  };
}

router.post(
  "/",
  auth(["creator"]),
  async (req: VideoRequest, res: Response) => {
    const { title, description, embedLink, tags, difficulty, category } =
      req.body;
    try {
      const video = new Video({
        title,
        description,
        embedLink,
        tags,
        difficulty,
        category,
        creator: req.user!.id,
      });
      await video.save();
      res.json(video);
    } catch (err) {
      res.status(500).json({ msg: "Server error" });
    }
  }
);

// Get all videos with pagination and filtering
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      tag,
      category,
      difficulty,
      search,
    } = req.query;
    const query: any = {};

    if (tag) query.tags = { $in: [tag] };
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (search) query.title = { $regex: search, $options: "i" };

    const videos = await Video.find(query)
      .populate("creator", "email")
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Video.countDocuments(query);

    res.json({
      videos,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Get creator's videos
router.get("/creator", auth(['creator']), async (req: any, res: Response) => {
  try {
    const videos = await Video.find({ creator: req.user.id })
      .populate("creator", "email")
      .sort({ createdAt: -1 });
    res.json({videos});
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Get unique tags
router.get("/tags", async (req, res) => {
  try {
    const tags = await Video.distinct("tags");
    res.json(tags);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Get unique categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Video.distinct("category");
    res.json(categories);
  } catch (err) {
    console.log(">>> error :", err);
    res.status(500).json({ msg: "Server error sss" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const video = await Video.findById(req.params.id);
    res.json(video);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.put(
  "/:id",
  auth(["creator"]),
  async (req: VideoRequest, res: Response) => {
    try {
      const video = await Video.findById(req.params.id);
      if (!video) return res.status(404).json({ msg: "Video not found" });
      if (video.creator.toString() !== req.user!.id)
        return res.status(403).json({ msg: "Unauthorized" });

      Object.assign(video, req.body);
      await video.save();
      res.json(video);
    } catch (err) {
      res.status(500).json({ msg: "Server error" });
    }
  }
);

router.delete(
  "/:id",
  auth(["creator", "admin"]),
  async (req: VideoRequest, res: Response) => {
    try {
      const video = await Video.findById(req.params.id);
      if (!video) return res.status(404).json({ msg: "Video not found" });
      if (
        video.creator.toString() !== req.user!.id &&
        req.user!.role !== "admin"
      ) {
        return res.status(403).json({ msg: "Unauthorized" });
      }

      await video.deleteOne();
      res.json({ msg: "Video deleted" });
    } catch (err) {
      res.status(500).json({ msg: "Server error" });
    }
  }
);

router.post(
  "/:id/like",
  auth(["viewer"]),
  async (req: VideoRequest, res: Response) => {
    try {
      const video = await Video.findById(req.params.id);
      if (!video) return res.status(404).json({ msg: "Video not found" });
      video.likes += 1;
      await video.save();
      res.json(video);
    } catch (err) {
      res.status(500).json({ msg: "Server error" });
    }
  }
);

router.post(
  "/:id/dislike",
  auth(["viewer"]),
  async (req: VideoRequest, res: Response) => {
    try {
      const video = await Video.findById(req.params.id);
      if (!video) return res.status(404).json({ msg: "Video not found" });
      video.dislikes += 1;
      await video.save();
      res.json(video);
    } catch (err) {
      res.status(500).json({ msg: "Server error" });
    }
  }
);

export default router;
