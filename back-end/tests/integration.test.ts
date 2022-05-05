import supertest from "supertest";
import app from "../src/app.js"
import { prisma } from "../src/database.js";
import { CreateRecommendationData } from "../src/services/recommendationsService.js";

describe("integration get tests",()=>{
  const recommendation: CreateRecommendationData = {
    name: "Avicii - The Nights",
    youtubeLink: "https://www.youtube.com/watch?v=UtF6Jej8yb4"
  }

  it("test get recommendations", async ()=>{
    const response = await supertest(app).get('/recommendations');
    expect(response.status).toEqual(200);
  })
  
  it("test get recommendation by id", async ()=>{
    const {id} = await prisma.recommendation.create({
      data: recommendation
    });
    
    const response = await supertest(app).get(`/recommendations/${id}`);
    expect(response.status).toEqual(200);
  })
  
  it("test get top recommendations", async ()=>{
    const take = 5;
    const recommendations = await prisma.recommendation.findMany({
      orderBy: { score: "desc" },
      take,
    });

    const response = await supertest(app).get(`/recommendations/top/${take}`);
    expect(response.status).toEqual(200);
    //expect(response.text).toEqual(recommendation)

  })
  
  it('test get random recommendations', async ()=>{
    await prisma.recommendation.create({
      data: recommendation
    });
    
    const response = await supertest(app).get(`/recommendations/random`);
    expect(response.status).toEqual(200);
  })

  afterEach(async () => {
    await prisma.recommendation.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
})

describe("tests posts", ()=>{
  const recommendation: CreateRecommendationData = {
    name: "Avicii - The Nights",
    youtubeLink: "https://www.youtube.com/watch?v=UtF6Jej8yb4"
  }

  it("test post recommendation", async ()=>{
    const response = await supertest(app).post('/recommendations').send(recommendation)
    const createdReconmmendation = prisma.recommendation.findUnique({
      where:{
        name: recommendation.name
      }
    });

    expect(createdReconmmendation).not.toBeNull();
    expect(response.status).toEqual(201);
  })

  it("test upvote ", async ()=>{
    const { name,id, score} = await prisma.recommendation.create({
      data: recommendation
    });
    console.log( id)

    const response = await supertest(app).post(`/recommendations/${id}/upvote`);
    const {score: newscore} = await prisma.recommendation.findUnique({
       where: {name}
     })

    expect(response.status).toEqual(200);
    expect(newscore).toEqual(score+1)
  })

  it("test bownvote ", async ()=>{
    const { name,id, score} = await prisma.recommendation.create({
      data: recommendation
    });

    const response = await supertest(app).post(`/recommendations/${id}/downvote`);
    const {score: newscore} = await prisma.recommendation.findUnique({
       where: {name}
     })

    expect(response.status).toEqual(200);
    expect(newscore).toEqual(score-1)
  })

  afterEach(async () => {
    await prisma.recommendation.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
})