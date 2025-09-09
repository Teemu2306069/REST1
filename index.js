let dictionary = [];
const express = require("express");
const fs = require("fs");

var app = express();
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));

/*CORS isn't enabled on the server, this is due to security reasons by default,
so no one else but the webserver itself can make requests to the server.*/
// Add headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  res.setHeader("Content-type", "application/json");

  // Pass to next layer of middleware
  next();
});

//Get dictionary
app.get("/words", (req, res) => {
  const data = fs.readFileSync("./sanakirja.txt", {
    encoding: "utf8",
    flag: "r",
  });
  //data:ssa on nyt koko tiedoston sisÃ¤ltÃ¶
  /*tiedoston sisÃ¤ltÃ¶ pitÃ¤Ã¤ pÃ¤tkiÃ¤ ja tehdÃ¤ taulukko*/
  const splitLines = data.split(/\r?\n/);
  /*TÃ¤ssÃ¤ voisi kÃ¤ydÃ¤ silmukassa lÃ¤pi splitLines:ssa jokaisen rivin*/
  splitLines.forEach((line) => {
    const words = line.split(" "); //sanat taulukkoon words
    console.log(words);
    const word = {
      fin: words[0],
      eng: words[1],
    };
    dictionary.push(word);
    console.log(dictionary);
  });

  res.json(dictionary);
});

//Get user specified word
app.get("/words/:word", (req, res) => {
  const targetWord = String(req.params.word);
  const data = fs.readFileSync("./sanakirja.txt", {
    encoding: "utf8",
    flag: "r",
  });

  let result = [];

  const splitLines = data.split(/\r?\n/);

  splitLines.forEach((line) => {
    const words = line.split(" "); //sanat taulukkoon words
    //console.log(words);
    //console.log("Tartget word: " + targetWord + " words[0]: " + words[0]);
    if (words[0] == targetWord) {
      const word = {
        fin: words[0],
        eng: words[1],
      };
      result.push(word);
      console.log(result);
    }
  });

  res.json(result);
});

//Tiedonlisäyksessä tallennetaan suomenkielinen sana ja vastaava englanninkielinen
// sana uudelle riville (tekstitiedostoa kasvatetaan uudella rivillä)
app.post("/words", (req, res) => {
  const word = req.body;

  console.log(word);

  const formattedWord = "\n" + word.fin + " " + word.eng;

  dictionary.push(word);

  fs.appendFileSync("./sanakirja.txt", formattedWord);

  res.json(dictionary);
});

//Â GETÂ aÂ user
/*app.get("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = data.find((user) => user.id === id);
  res.json(user ? user : { message: "NotÂ found" });
});
//Â ADDÂ aÂ user
app.post("/users", (req, res) => {
  const user = req.body;
  data.push(user);
  res.json(data);
});
//Â UPDATEÂ aÂ user
app.put("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const updatedUser = req.body;
  data = data.map((user) => (user.id === id ? updatedUser : user));
  res.json(data);
});
//Â DELETEÂ aÂ user
app.delete("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  data = data.filter((user) => user.id !== id);
  res.json(data);
});*/

const port = 3000;
app.listen(port, () => {
  console.log("Server is listening to a port: " + port);
});
