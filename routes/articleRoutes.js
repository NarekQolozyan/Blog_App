import express from "express";
import { createArticle, deleteArticle, deleteComment, getAllArticleById, getAllArticles, leaveComment, updateArticle } from "../controllers/article_controller.js";
const router = express.Router()

router.get('/articles', getAllArticles)
router.get('/articles/:articleId', getAllArticleById)
router.post('/createArticle/:userId', createArticle)
router.put('/articles/updateArticle/:articleId', updateArticle)
router.delete('/articles/deleteArticle/:userId', deleteArticle)
router.post('/articles/:articleId/comment', leaveComment)
router.delete('/articles/:articleId/comments', deleteComment)

export default router