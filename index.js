const http = require("http");
const path = require("path");
const fs = require("fs");
const {MongoClient} = require("mongodb");


// const getMovies = async (client) =>{
//     const cursor = client.db("movies").collection("movieList").find({});
//     const results = await cursor.toArray();
//     return JSON.stringify(results);
// }

const getMovies = async (client) => {
  const doc = await client.db("movies").collection("movieList").findOne({});
  return JSON.stringify(doc.movies);  //
};


const server = http.createServer(async (req, res) => {
  if (req.url === '/') {
    fs.readFile(path.join(__dirname, 'public', 'index.html'),
      (err, content) => {
        if (err) throw err;
        res.setHeader("Access-Control-Allow-Origin", "*")
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      }
    );
  }
  else if (req.url === '/style.css') {
    fs.readFile(path.join(__dirname, 'public', 'style.css'),
      (err, content) => {

        if (err) throw err;
        res.setHeader("Access-Control-Allow-Origin", "*")
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.end(content);
      }
    );
  }
  else if (req.url.startsWith('/assets/')) {
    const assetPath = path.join(__dirname, 'public', req.url);
    fs.readFile(assetPath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
        return;
      }
      const contentType = path.extname(assetPath) === '.jpg' ? 'image/png' : 'image/jpeg';
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  }
  else if (req.url === "/api"){
    const URL = "mongodb+srv://sbair2:Saiadithya%4080@cluster0.iw5enai.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    const client = new MongoClient(URL);
    try{
        await client.connect();
        console.log("Database is connected sucessfully") ;
        const guns = await getMovies(client);
        res.setHeader("Access-Control-Allow-Origin","*");
        res.writeHead(200,{"content-type":"application/json"});
        console.log(guns);
        res.end(guns);
    }
    catch(err){
        console.log("Error in connecting database",err);
    }
    finally{
        await client.close();
        console.log("Database connection is closed");
    }
}
  else {
    res.end("<h1> 404 not found</h1>");
  }
});

const PORT = process.env.PORT || 1397;
server.listen(PORT, () => console.log(`Server is running on port ${PORT} `));