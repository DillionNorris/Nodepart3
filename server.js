
const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());

const upload = multer({ dest: __dirname + "/public/images" });
//makes index the home page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
let teams = [
  {
    _id: 1,
    name: "Panthers",
    qb: "Bryce Young",
    rb: "Chuba Hubbard",
    wr1: "Adam Theilen",
    wr2: "Dj Chark",
    wr3: "Terrance Marshal jr",
  },
  {
    _id: 2,
    name: "Dolphins",
    qb: "Tua Tagovailoa",
    rb: "Raheem Mostert",
    wr1: "Tyreek Hill",
    wr2: "Jaylen Waddle",
    wr3: "Braxton Berrios",
  },
  {
    _id: 3,
    name: "Titans",
    qb: "Will Levis",
    rb: "Derrick Henry",
    wr1: "DeAndre Hopkins",
    wr2: "Treylon Burks",
    wr3: "Nick Westbrook-Ikhine",
  },
  {
    _id: 4,
    name: "Lions",
    qb: "Jared Goff",
    rb: "David Montgomery",
    wr1: "Amon-Ra St. Brown",
    wr2: "Josh Reynolds",
    wr3: "Jameson Williams",
  },
  {
    _id: 5,
    name: "Colts",
    qb: "Gardner Minshew",
    rb: "Jonathan Taylor",
    wr1: "Michael Pittman",
    wr2: "Josh Downs",
    wr3: "Alec Pierce",
  },
  {
    _id: 6,
    name: "Chargers",
    qb: "Justin Herbert",
    rb: "Austin Ekeler",
    wr1: "Keenan Allen",
    wr2: "Quentin Johnston",
    wr3: "Jalen Guyton",
  },
];

// makes sure team has nessisarry requirements 
const validateTeam = (team) => {
    
  const schema = Joi.object({
    _id: Joi.allow(""),
    name: Joi.string().required(),
    qb: Joi.string().required(),
    rb: Joi.string().required(),
    wr1: Joi.string().required(),
    wr2: Joi.string().required(),
    wr3: Joi.string().required(),
  });
  return schema.validate(team);
};

// able to accsess the api via the browser
app.get("/api/teams", (req, res) => {
  res.send(teams);
});

app.post("/api/teams", upload.single("img"),(req, res) => {
  const result = validateTeam(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }
  const team = {
    _id: teams.length + 1,
    name: req.body.name,
    qb: req.body.qb,
    rb: req.body.rb,
    wr1: req.body.wr1,
    wr2: req.body.wr2,
    wr3: req.body.wr3,
  };

  teams.push(team);
  res.send(teams);
});

app.put("/api/teams/:id", upload.single("img"),(req, res) => {
    const id = parseInt(req.params.id);
    const team = teams.find((t) => t._id === id);;
    const result = validateTeam(req.body);

    if (result.error){
        res.status(400).send(result.error.details[0].message)
        return;
    }

    team.name = req.body.name;
    team.qb = req.body.qb;
    team.rb = req.body.rb;
    team.wr1 = req.body.wr1;
    team.wr2 = req.body.wr2;
    team.wr3= req.body.wr3;

    res.send(team);

});

app.delete("/api/teams/:id",(req,res) =>{
  const id = parseInt(req.params.id);
  const team = teams.find((t) => t._id === id);;

  if(!team){
    res.status(404).send("team was not found");
  }

  const index = teams.indexOf(team);
  teams.splice(index, 1);
  res.send(team);


});

//sever start
app.listen(3000, () => {
  console.log("listening on port 3000...");
});
