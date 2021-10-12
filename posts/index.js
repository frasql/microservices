import fetch from 'node-fetch';
import bodyParser from 'body-parser';
import {randomBytes} from 'crypto';
import express from 'express';
import cors from 'cors';



const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json({
    type: ['application/json', 'text/plain']
}));
app.use(cors())

const posts = {};

app.get("/posts/", (req, resp) => {
    resp.send(posts)

});

app.post("/posts/create/", async (req, resp) => {
    const id = randomBytes(4).toString("hex");
    const { title } = req.body;

    posts[id] = {
        id, title
    }

    await fetch("http://event-bus-srv:4001/events", {
        method: "POST",
        mode:"cors",
        body: JSON.stringify({
            type: "PostCreated",
            data: {
                id, title
            }
        })
    })

    console.log("Received")
    resp.status(201).send(posts[id])
})


app.post("/events", (req, res) => {
    console.log("EVENT RECEIVED");
    console.log(req.body)
    console.log("Received Event", req.body.type);

    res.send({

    })
})


app.listen(4000, () => {
    console.log("Ehi posts port 4000")
});