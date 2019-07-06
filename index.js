const express = require("express");
const express_graphql = require("express-graphql");
const { buildSchema } = require("graphql");

const schema = buildSchema(`
  type Query {
    pet(id: Int!): Pet
    pets(animalType: String): [Pet]
  },
  type Mutation {
    updatePetName(id: Int!, name: String!): Pet
  },
  type Pet {
    id: Int
    name: String
    animalType: String
    breed: String
    age: Int
    favorite_treat: String
    owner: Owner
  }
  type Owner {
    id: Int
    name: String
    pets: [Pet]
  }
`);

var owners = [
  {
    id: 1,
    name: "Jane Doe",
    pets: [
      {
        id: 1,
        name: "Bubbles",
        animalType: "dog",
        breed: "Boston Terrier",
        age: 3,
        favorite_treat: "blueberries"
      },
      {
        id: 3,
        name: "Fluffy",
        animalType: "cat",
        breed: "long-hair",
        age: 7,
        favorite_treat: "catnip"
      }
    ]
  },
  {
  id: 2,
  name: "John Doe",
  pets: 
  [
    {
      id: 2,
      name: "Fiona",
      animalType: "dog",
      breed: "Mini Australian Shepherd",
      age: 1,
      favorite_treat: "pepperoni"
    },
  ]
  }
];

var pets = [
  {
    id: 1,
    name: "Bubbles",
    animalType: "dog",
    breed: "Boston Terrier",
    age: 3,
    favorite_treat: "blueberries",
    owner: {
      id:1,
      name: "Jane Doe"
    }
  },
  {
    id: 2,
    name: "Fiona",
    animalType: "dog",
    breed: "Mini Australian Shepherd",
    age: 1,
    favorite_treat: "pepperoni",
    owner: {
      id:2,
      name: "John Doe"
    }
  },
  {
    id: 3,
    name: "Fluffy",
    animalType: "cat",
    breed: "long-hair",
    age: 7,
    favorite_treat: "catnip",
    owner: {
      id:1,
      name: "Jane Doe"
    }
  }
];

var getPet = function(arguments) {
  let id = arguments.id;
  return pets.filter(pet => {
    return pet.id == id;
  })[0];
};

var getPets = function(arguments) {
  if (arguments.animalType) {
    var animalType = arguments.animalType;
    return pets.filter(pet => pet.animalType === animalType);
  } else {
    return pets;
  }
};

var updatePetName = function({ id, name }) {
  pets.map(pet => {
    if (pet.id === id) {
      pet.name = name;
      return pet;
    }
  });
  return pets.filter(pet => pet.id === id)[0];
};

const root = {
  pet: getPet,
  pets: getPets,
  updatePetName: updatePetName
};

const app = express();

app.use(
  "/graphql",
  express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
);

app.listen(3000, () =>
  console.log("Express GraphQL Server Now Running On localhost:3000/graphql")
);