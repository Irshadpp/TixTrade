import express from "express";
import jwt from "jsonwebtoken";
import { currentUser} from "@ir-tixtrade/common"

const router = express.Router();

router.get("/api/users/current-user", currentUser, (req, res) => {
  console.log("called current-user api to check authentication");
  res.status(200).send({currentUser: req.currentUser || null});
});

export { router as currentUserRouter };
