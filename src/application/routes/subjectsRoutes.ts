import { Router } from "express";
import { SubjectsController } from "../controllers";

const subjectsRouter = Router();

subjectsRouter.post("/subjects", SubjectsController.create);
subjectsRouter.get("/subjects", SubjectsController.findAll);
subjectsRouter.get("/subjects/:id", SubjectsController.findById);
subjectsRouter.put("/subjects/:id", SubjectsController.update);
subjectsRouter.delete("/subjects/:id", SubjectsController.exclude);

subjectsRouter.get("/subjects/:id/students", SubjectsController.findStudents);

export { subjectsRouter };
