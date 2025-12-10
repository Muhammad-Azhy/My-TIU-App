import prisma from "../../prisma/prismaClient";

const getNews = async () => {
  return prisma.news.findMany(); //we need pagination limit it by 10 news at once 
};

const createNews = async (data) => {
  return prisma.news.create(data);
};
//[1,2,3,4,D]