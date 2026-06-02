import { Router } from "express";
import multer from "multer";
import { FileController } from "../controllers/fileController";
import { asyncHandler } from "../../shared/http/asyncHandler";
import { requireAuth } from "../../shared/http/requireAuth";
import { HttpError } from "../../shared/errors/httpError";
import { getFileLimitsForPlan } from "../../shared/plan/fileLimits";

const router = Router();
const controller = new FileController();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    const mime = file.mimetype.split(";")[0]?.trim().toLowerCase() ?? "";
    const allowed =
      mime === "application/pdf" ||
      mime.startsWith("text/") ||
      file.originalname.endsWith(".md") ||
      file.originalname.endsWith(".txt") ||
      file.originalname.endsWith(".csv");
    if (!allowed) {
      cb(new HttpError(400, "Solo PDF, TXT, Markdown o CSV"));
      return;
    }
    cb(null, true);
  },
});

router.post(
  "/",
  requireAuth,
  (req, _res, next) => {
    const limits = getFileLimitsForPlan(req.auth?.planType);
    upload.single("file")(req, _res, (err) => {
      if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
        next(new HttpError(413, "Archivo demasiado grande"));
        return;
      }
      next(err);
    });
  },
  asyncHandler(controller.upload.bind(controller)),
);

router.get("/", requireAuth, asyncHandler(controller.index.bind(controller)));
router.delete("/:id", requireAuth, asyncHandler(controller.destroy.bind(controller)));

export { router as fileRoutes };
