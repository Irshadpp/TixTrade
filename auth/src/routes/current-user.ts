import express from "express";

const router = express();

router.get('/api/users/current-user', (req, res)=>{
    res.send("hi there");
});

export {router as currentUserRouter};