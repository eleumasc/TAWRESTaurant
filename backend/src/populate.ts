require("./config");
import mongoose = require("mongoose");
import {
  WaiterModel,
  CookModel,
  BarmanModel,
  CashierModel,
  FoodModel,
  BeverageModel,
  TableModel
} from "./models";
import { UserRole } from "./models/user";

type PopulateInfo = {
  info: object;
  model: mongoose.Model<any>;
  logMessage: String;
  calls?: [{ method: string; args: any[] }];
};

const populateInfo: PopulateInfo[] = [
  {
    info: {
      username: "waiter1",
      name: "Qui",
      surname: "Non c'è",
      role: UserRole.Waiter
    },
    logMessage: "Waiter: Qui",
    model: WaiterModel,
    calls: [{ method: "setPassword", args: ["waiter1"] }]
  },
  {
    info: {
      username: "waiter2",
      name: "Qua",
      surname: "Neppure",
      role: UserRole.Waiter
    },
    logMessage: "Waiter: Qua",
    model: WaiterModel,
    calls: [{ method: "setPassword", args: ["waiter2"] }]
  },
  {
    info: {
      username: "cook1",
      name: "Paolino",
      surname: "Paperino",
      role: UserRole.Cook
    },
    logMessage: "Cook: Paperino",
    model: CookModel,
    calls: [{ method: "setPassword", args: ["cook1"] }]
  },
  {
    info: {
      username: "cook2",
      name: "Nonna",
      surname: "Papera",
      role: UserRole.Cook
    },
    logMessage: "Cook: Papera",
    model: CookModel,
    calls: [{ method: "setPassword", args: ["cook2"] }]
  },
  {
    info: {
      username: "barman1",
      name: "Gastone",
      surname: "Paperone",
      role: UserRole.Barman
    },
    logMessage: "Barman: Gastone",
    model: BarmanModel,
    calls: [{ method: "setPassword", args: ["barman1"] }]
  },
  {
    info: {
      username: "barman2",
      name: "Paperoga",
      surname: "Paperone",
      role: UserRole.Barman
    },
    logMessage: "Barman: Paperoga",
    model: BarmanModel,
    calls: [{ method: "setPassword", args: ["barman2"] }]
  },
  {
    info: {
      username: "cashier1",
      name: "Paperon",
      surname: "De' Paperoni",
      role: UserRole.Cashier
    },
    logMessage: "Cashier: Paperone",
    model: CashierModel,
    calls: [{ method: "setPassword", args: ["cashier1"] }]
  },
  {
    info: {
      name: "Tacchino",
      price: 20,
      preparationTime: 30
    },
    logMessage: "Food: Tacchino",
    model: FoodModel
  },
  {
    info: {
      name: "Fiorentina",
      price: 20,
      preparationTime: 15
    },
    logMessage: "Food: Fiorentina",
    model: FoodModel
  },
  {
    info: {
      name: "Cotoletta",
      price: 8,
      preparationTime: 8
    },
    logMessage: "Food: Cotoletta",
    model: FoodModel
  },
  {
    info: {
      name: "Spaghetti amatriciana",
      price: 7,
      preparationTime: 10
    },
    logMessage: "Food: Spaghetti amatriciana",
    model: FoodModel
  },
  {
    info: {
      name: "Pennette amatriciana",
      price: 7,
      preparationTime: 10
    },
    logMessage: "Food: Pennette amatriciana",
    model: FoodModel
  },
  {
    info: {
      name: "Gnocchi pomodoro",
      price: 5,
      preparationTime: 10
    },
    logMessage: "Food: Gnocchi pomodoro",
    model: FoodModel
  },
  {
    info: {
      name: "Spaghetti carbonara",
      price: 7,
      preparationTime: 10
    },
    logMessage: "Food: Spaghetti carbonara",
    model: FoodModel
  },
  {
    info: {
      name: "Pizza Margherita",
      price: 5,
      preparationTime: 10
    },
    logMessage: "Food: Pizza Margherita",
    model: FoodModel
  },
  {
    info: {
      name: "Pizza Diavola",
      price: 7,
      preparationTime: 10
    },
    logMessage: "Food: Pizza Diavola",
    model: FoodModel
  },
  {
    info: {
      name: "Pizza Patatosa",
      price: 6.5,
      preparationTime: 10
    },
    logMessage: "Food: Pizza Patatosa",
    model: FoodModel
  },
  {
    info: {
      name: "Pizza Gurmet",
      price: 15,
      preparationTime: 10
    },
    logMessage: "Food: Pizza Gurmet",
    model: FoodModel
  },
  {
    info: {
      name: "Pizza Tonno Cipolla",
      price: 7.5,
      preparationTime: 10
    },
    logMessage: "Food: Pizza Tonno Cipolla",
    model: FoodModel
  },
  {
    info: {
      name: "Pizza Prosciutto Funghi",
      price: 7,
      preparationTime: 10
    },
    logMessage: "Food: Pizza Prosciutto Funghi",
    model: FoodModel
  },
  {
    info: {
      name: "Acqua Naturale 0,5l",
      price: 1.5,
      preparationTime: 1
    },
    logMessage: "Beverage: Acqua Naturale 0,5l",
    model: BeverageModel
  },
  {
    info: {
      name: "Acqua Frizzante 0,5l",
      price: 1.5,
      preparationTime: 1
    },
    logMessage: "Beverage: Acqua Frizzante 0,5l",
    model: BeverageModel
  },
  {
    info: {
      name: "Coca Cola 33cl",
      price: 3,
      preparationTime: 1
    },
    logMessage: "Beverage: Coca Cola",
    model: BeverageModel
  },
  {
    info: {
      name: "Fanta 33cl",
      price: 3,
      preparationTime: 1
    },
    logMessage: "Beverage: Fanta",
    model: BeverageModel
  },
  {
    info: {
      name: "Mohito",
      price: 3,
      preparationTime: 5
    },
    logMessage: "Beverage: Mohito",
    model: BeverageModel
  },
  {
    info: {
      name: "Spritz",
      price: 4,
      preparationTime: 5
    },
    logMessage: "Beverage: Spritz",
    model: BeverageModel
  },
  {
    info: {
      name: "Caffé",
      price: 2,
      preparationTime: 3
    },
    logMessage: "Beverage: Caffé",
    model: BeverageModel
  },
  {
    info: {
      number: 1,
      seats: 4
    },
    logMessage: "Table: 1",
    model: TableModel
  },
  {
    info: {
      number: 2,
      seats: 6
    },
    logMessage: "Table: 2",
    model: TableModel
  },
  {
    info: {
      number: 3,
      seats: 2
    },
    logMessage: "Table: 3",
    model: TableModel
  },
  {
    info: {
      number: 4,
      seats: 10
    },
    logMessage: "Table: 4",
    model: TableModel
  },
  {
    info: {
      number: 5,
      seats: 8
    },
    logMessage: "Table: 5",
    model: TableModel
  },
  {
    info: {
      number: 6,
      seats: 5
    },
    logMessage: "Table: 6",
    model: TableModel
  },
];

(async () => {
  await mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true
  });
  console.log("Connected to MongoDB");

  await populate(populateInfo);

  await mongoose.disconnect();
})();

async function populate(info: PopulateInfo[]) {
  await Promise.all(
    info.map(
      data =>
        new Promise((resolve, reject) => {
          const doc = new data.model(data.info);
          data.calls &&
            data.calls.forEach(call => {
              doc[call.method].apply(doc, call.args);
            });
          doc.save(err => {
            console.log(
              `${data.logMessage} ${!err ? "SUCCESS" : `FAIL (${err.message}`}`
            );
            resolve();
          });
        })
    )
  );
}
