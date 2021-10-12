import fetch from 'node-fetch';
import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';



const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json({
    type: ['application/json', 'text/plain']
}));
app.use(cors());



app.post("/events", async (req, res) => {

    const {type, data} = req.body;

    if (type === 'CommentCreated') {
        const status = data.content.includes('fuck') ? 'rejected': 'approved'
        
        await fetch("http://event-bus-srv:4001/events", {
            methods: "POST",
            mode: "cors",
            body: JSON.stringify({
                type: 'CommentModerated',
                data: {
                    id: data.id,
                    postId: data.postId,
                    status,
                    content: data.content

                }
            })
        })
    
    }

    res.send({});

    console.log("From Moderation Event Received", data)

})



app.listen(4003, () =>{
    console.log("Moderation server on port 4003");
})
