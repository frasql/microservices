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
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments", async (req, resp) => {
    resp.send(commentsByPostId[req.params.id] || [])
});

app.post("/posts/:id/comments", async (req, resp) => {
    const commentId = randomBytes(4).toString("hex");
    const {content} = req.body;


    const comments = commentsByPostId[req.params.id] || []

    comments.push({id: commentId, content, status: 'pending'});

    commentsByPostId[req.params.id] = comments;

    await fetch("http://event-bus-srv:4001/events", {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({
            type: "CommentCreated",
            data: {
                id: commentId,
                content,
                postId: req.params.id,
                status: 'pending'
            }
        })
    })

    resp.status(201).send(comments)

});



app.post("/events", async (req, res) => {
    const {type, data} = req.body;

    if (type === 'CommentModerated') {
        const {postId, id, status, content} = data;

        const comments = commentsByPostId[postId];

        const comment = comments.find(comment => {
            return comment.id === id;
        });

        comment.status = status;

        await fetch("http://event-bus-srv:4001/events", {
            methods: "POST",
            mode: "cors",
            body: JSON.stringify({
                type: "CommentUpdated",
                data: {
                    postId,
                    id,
                    content,
                    status
                }
            })
        })
    }

    consoele.log("Comments Event REceived")
    console.log(data)

    res.send({

    })
})



app.listen(2000, () => {
    console.log("Ehi comments port 2000");
})