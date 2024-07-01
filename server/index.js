const express = require('express');
const app = express();
const cors = require('cors');
// Use CORS middleware
app.use(cors());
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const  bodyParser = require('body-parser')
const fs = require("fs").promises

app.use(bodyParser.json());
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
});

app.get('/', (req, res) => {
    res.status(200).send("OK");
});

app.post('/vector', (req, res) => {
    //console.log(req.body);
    io.send(JSON.stringify(req.body));
    res.status(202).send();
});

const slideIndexToConfig = new Map()
slideIndexToConfig.set("00", "apache_star_start.yaml");
slideIndexToConfig.set("12", "apache_star_text.yaml");
slideIndexToConfig.set("24", "simple.yaml");
slideIndexToConfig.set("34", "docker_logs.yaml");
slideIndexToConfig.set("25", "simple_json.yaml");
slideIndexToConfig.set("52", "parse_apache.yaml");
slideIndexToConfig.set("53", "route_apache.yaml");
slideIndexToConfig.set("54", "custom_timestamp.yaml");
slideIndexToConfig.set("55", "function_del.yaml");
slideIndexToConfig.set("551", "function_redact.yaml");
slideIndexToConfig.set("60", "apache_star_text.yaml");

async function fragmentshown({indexh, indexv, indexf}) {
  const slideIndex = `${indexh}${indexv}${indexf}`
  const config = slideIndexToConfig.get(slideIndex);
  if (config === undefined) {
    console.log(`fragmentshown: slideIndex=${slideIndex}`);
    return;
  }

  const yamlContent = await fs.readFile(`/Users/fdubrez/git/github/breizhcamp-vector/vector/config/${config}`, {encoding: "utf-8"});
  await fs.writeFile(`/Users/fdubrez/git/github/breizhcamp-vector/vector/vector.yaml`, yamlContent);
  console.log(`fragmentshown: conf is now ${config}`);
}

const slidechanged = async ({indexh, indexv}) => {
  const slideIndex = `${indexh}${indexv}`
  const config = slideIndexToConfig.get(slideIndex);
  if (config === undefined) {
    console.log(`slidechanged: slideIndex=${slideIndex}`);
    return;
  }

  const yamlContent = await fs.readFile(`/Users/fdubrez/git/github/breizhcamp-vector/vector/config/${config}`, {encoding: "utf-8"});
  await fs.writeFile(`/Users/fdubrez/git/github/breizhcamp-vector/vector/vector.yaml`, yamlContent);
  console.log(`slidechanged: conf is now ${config}`);
}

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on("slidechanged", async (data) => {
    const event = JSON.parse(data)
    await slidechanged(event);
  })
  socket.on("fragmentshown", async (data) => {
    const event = JSON.parse(data)
    await fragmentshown(event);
  })
});

PORT = process.env.PORT || 9000

server.listen(PORT, '0.0.0.0', () => {
  console.log(`listening on *:${PORT}`);
});
