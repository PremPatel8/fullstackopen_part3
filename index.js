const { json } = require("body-parser");
const express = require("express");
var morgan = require('morgan')

const app = express();
app.use(express.json());
morgan.token('data', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

// 3.1: Phonebook backend step1
app.get("/api/persons", (request, response) => {
  response.json(persons);
});

// 3.3: Phonebook backend step3
app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

// 3.2: Phonebook backend step2
app.get("/api/info", (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
  );
});

// 3.4: Phonebook backend step4
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

// 3.6: Phonebook backend step6
const generateId = () => {
  return Math.floor(Math.random() * 1000);
};
// 3.6: Phonebook backend step6
app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name && !body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  if (!body.name) {
    return response.status(400).json({
      error: "Name is missing",
    });
  }

  if (persons.some((person) => person.name === body.name)) {
    return response.status(400).json({ error: "name must be unique" });
  }

  if (!body.number) {
    return response.status(400).json({
      error: "Number is missing",
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
    // date: new Date(),
  };

  persons = persons.concat(person);

  response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
