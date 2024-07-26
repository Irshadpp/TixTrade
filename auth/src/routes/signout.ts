import express from "express";

const router = express();

router.post('/api/users/signout', (req, res)=>{
    res.send("hi there");
});

export {router as signoutRouter};