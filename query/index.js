import bodyParser from 'body-parser';
import {randomBytes} from 'crypto';
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json({
    type: ['application/json', 'text/plain']
}));
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
    if (type === 'PostCreated') {
        const {id, title} = data;
        posts[id] = {id, title, comments: []};

    }
    else if (type === 'CommentCreated') {

        const {id, content, postId, status} = data;

        posts[postId].comments.push({id, content, status});

    }
    else if (type === 'CommentUpdated') {
        const {id, content, postId, status} = data

        const post = posts[postId];

        const comment = post.comment.find(comment => {
            return comment.id === id;
        })

        comment.status = status;
        comment.content = content;
    }
}


app.get('/posts', (req, res) => {
    res.send(posts);

});


app.post('/events', (req, res) => {
    const {type, data} = req.body;

    handleEvent(type, data);

    res.send({});
});


app.listen(4002, async () => {
    console.log("Query Service port 4002");

    try {
        const res = await fetch("http://event-bus-srv:4001/events", {
            method: "GET",
            mode: "cors"
        });

        /*

        if (res.ok) {
            for (let event of res.data) {
                console.log('Procesing event: ', event.type);
                handleEvent(event.type, event.data);
            } 
        }
        */
       console.log(res)
       console.log("Query service")
       console.log("Event reveived")

    }catch(err) {
        console.log(err);
    }
});
