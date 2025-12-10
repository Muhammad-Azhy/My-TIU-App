/*
model News {
  id           Int        @id @default(autoincrement())
  title        String
  content      String
  imageUrl     String? //list of image
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt
  deletedAt    DateTime? // Optional: soft delete

  departmentId Int?       // null = global news
  department   Department? @relation(fields: [departmentId], references: [id], onDelete: SetNull)

  @@index([departmentId])
}


model Department {
  id        Int       @id @default(autoincrement())
  name      String    @unique
  code      String?   @unique // ex: "CS", "MN", "IT"
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime? 
  students      Student[]
  teachers      Teacher[]
  news          News[]
  announcements Announcement[]
  courses Course[]
}

*/

const getNews = (news) =>
  news.array.forEach((news) => ({
    id: news.id,
    title: news.title,
    content: news.content,
    imageUrl: news.imageUrl ? news.imageUrl : null,
    createdAt: news.createdAt,
    department: news.departmentId
      ? {
          id: news.department.id,
          name: news.department.name,
          code: news.department.code,
        }
      : null,
  }));

// const getOneNews = (news) =>
//   news.array.forEach((news) => ({
//     id: news.id,
//     title: news.title,
//     content: news.content,
//     imageUrl: news.imageUrl ? news.imageUrl : null,
//     createdAt: news.createdAt,
//     department: news.departmentId
//       ? {
//           id: news.department.id,
//           name: news.department.name,
//           code: news.department.code,
//         }
//       : null,
// }));

const createNews = (data) => {
  if (!data.title || !data.content) {
    const error = new Error("Missing 1 or more fields");
    error.name = "ValidationError";
    throw error;
  }
  return { data };
};

export const newsDto = { getNews, createNews };
/*


import Express from "express";
import { PrismaClient } from "@prisma/client";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { body, validationResult } from 'express-validator';
import jwt from "jsonwebtoken";
const prisma = new PrismaClient()

function verifyToken(req, res, next) {
  // Get the token from the request headers
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token,"sdimnmidn", (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.user = decoded;
    next();
  });
}



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./Media");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const uploader = multer({ storage: fileStorageEngine });

const validateLogin = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(402).json({ errors: errors.array() });
    }
     const { username , password} = req.body;
    const existingUser = await prisma.user.findFirst({where:{
      username,
      password
    }});
    if (!existingUser) {
      return res.status(402).json({ error: 'User not found' });
    }
    next();
  },
];
const validateSignIn =[
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(402).json({ errors: errors.array() });
    }
    next();
  },
];
const validateFiles = async (req, res, next) => {
   const myId = req.user.myId
  const files = req.files;
  if (!files || files.length !== 3) {
      let filesSent = files.length;
      const remainingFiles = 3-filesSent;
      if(remainingFiles === 3)
         return res.status(402).send("no files sent");
       return res.status(402).send(`missing ${remainingFiles} files`);
  }
  const user = await prisma.user.findFirst({
    where: {
      id: +myId,
    },
  });

  if (!user) {
    return res.status(404).send("User not found (invalid id).");
  }
 
  if (user.isAuthor === false) {
    return res.status(402).send("Not qualified to publish books.");
  }
  next();
};
const validateFields = [
    body("title").notEmpty().withMessage("Title of book is needed"),
    body("desc").notEmpty().withMessage("Description of book is needed"),
    body("price").notEmpty().withMessage("Price of book is needed"),
    async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(402).json({ errors: errors.array() });
    }
    next();
}
    
]

*/