// import {prisma} from "../src/database.js";

// async function main() {
//   await prisma.recommendation.upsert({
//     where: {  name: "K-391 & Alan Walker - Ignite", },
//     update: {},
//     create: {
//       name: "K-391 & Alan Walker - Ignite",
//       youtubeLink: "https://www.youtube.com/watch?v=Az-mGR-CehY",
//     },
//   })
// }

// main()
//   .catch((e) => {
//     console.log(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });