import express from "express";
import { json } from "body-parser";
import "express-async-errors";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from "@ir-tixtrade/common"
import { indexOrderRouter } from "./routes";
import { showOrderRouter } from "./routes/show";
import { newOrderRouter } from "./routes/new";
import { deleteOrderRouter } from "./routes/delete";


const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'  //for testing, otherwise give true
  })
);
app.use(currentUser)

app.use(indexOrderRouter);
app.use(showOrderRouter);
app.use(newOrderRouter);
app.use(deleteOrderRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
