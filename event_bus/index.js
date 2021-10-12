import fetch from 'node-fetch';
import express from 'express';
import cors from 'cors';


const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json({
    type: ['application/json', 'text/plain']
}));
app.use(cors());

async function PostEvent(url, data) {
    const resp = await fetch(url, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(data)
    })
    if (resp.ok) {
        return resp.json()
    }
}

const events = [];


app.post("/events", async (req, res) => {
    const event = req.body;
    
    events.push(event);
     
    const urls = [
        "http://posts-clusterip-srv:4000/events", 
        "http://comments-srv:2000/events", 
        "http://frontend-srv:3000/events",
        "http://query-srv:4002/events",
        "http://moderation-srv:4003/events"
    ];


    urls.forEach(url => {
        PostEvent(url, event);
    });

    console.log("Event: ", event)


    res.send({status: "OK"});
})


app.get("/events", (req, res) => {
    res.send(events);
    console.log("Event Bus sending events")
})



app.listen(4001, () => {
    console.log("Event bus port 4001")
})
