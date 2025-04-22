const { PrismaClient: UsersClient } = require("../../../prisma/src/generated/prisma");
const { PrismaClient: BillsClient } = require("../../../prisma/generated/mariadb");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { faker } = require("@faker-js/faker");
const Video = require("../models/videosModel");

const usersPrisma = new UsersClient();
const billsPrisma = new BillsClient();

async function seedUsers() {
  const users = [];

  for (let i = 0; i < 100; i++) {
    const password = await bcrypt.hash("password", 12);
    const isDeleted = faker.datatype.boolean({ probability: 0.1 });

    users.push({
      name: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email().toLowerCase(),
      password,
      rol: i < 5 ? "Administrador" : "Cliente",
      createdAt: faker.date.past({ years: 1 }),
      deletedAt: isDeleted ? faker.date.recent({ days: 30 }) : null,
    });
  }

  await usersPrisma.users.createMany({
    data: users,
    skipDuplicates: true,
  });

  return await usersPrisma.users.findMany({ where: { deletedAt: null } });
}

async function seedBills(users) {
  const billStates = ["Pendiente", "Pagado", "Vencido"];
  const bills = [];

  for (let i = 0; i < 320; i++) {
    const user = faker.helpers.arrayElement(users);
    const state = faker.helpers.arrayElement(billStates);
    const issueDate = faker.date.past({ years: 1 });
    const paidDate = state === "Pagado" ? faker.date.recent({ days: 30 }) : null;

    bills.push({
      userId: user.id,
      state,
      quantity: faker.number.int({ min: 10, max: 500 }),
      issueDate,
      paidDate,
      active: faker.datatype.boolean({ probability: 0.9 }),
    });
  }

  await billsPrisma.bills.createMany({ data: bills });
}

async function seedVideos() {
  await mongoose.connect("mongodb://admin:root@localhost:27017/");

  const videos = Array.from({ length: 420 }, () => ({
    title: faker.lorem.words(3),
    description: faker.lorem.sentences(2),
    genre: faker.helpers.arrayElement(["Acción", "Drama", "Comedia", "Terror", "Sci-Fi"]),
    available: faker.datatype.boolean({ probability: 0.95 }),
  }));

  await Video.insertMany(videos);
}

async function main() {
  console.log("Seeding usuarios");
  const users = await seedUsers();

  console.log("Seeding facturas");
  await seedBills(users);

  console.log("Seeding videos");
  await seedVideos();

  console.log("Seed completado");
  process.exit();
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
