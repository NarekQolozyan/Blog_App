import mongoose from "mongoose";
import {User} from "./user_controller.js"; 
import articleSchema from "../schema/article_schema.js";
import jwt from "jsonwebtoken"
import * as dotenv from 'dotenv'
dotenv.config()

const Article = mongoose.model('Article', articleSchema);

const createArticle = async (req, res) => {
    const { title, content } = req.body;
    const {authorId} = req.params;

    try {
        
        const author = await User.findOne({ id: authorId });
        if (!author) {
            return res.status(404).json({ error: "Author not found" });
        }

        const newArticle = new Article({
            title,
            content,
            author: author.username,
        });

        await newArticle.save();

        return res.json({ status: "Article created", article: newArticle });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getAllArticles = async (req, res) => {
    try {
        const articles = await Article.find({});
        
        res.send(articles);
      } catch (error) {
        console.error(error);
        res.status(500).send(error);
      }
}

const getAllArticleById = async (req, res) => {
    const { id } = req.params
    try{
        const article = await Article.findById(id)
        console.log(article)
        res.send(article)
    } catch(err) {
        console.error("Aricle not found: ", err)
        res.status(500).send(err)
    } 
}

const updateArticle = async (req, res) => {
    const { id } = req.params
    const token = req.headers.authorization;
    
    if (!token) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }
    try{
        const decodedToken = jwt.verify(token, process.env.TOCEN_SECRET);
      
        if (!decodedToken) {
            return res.status(401).json({ error: "Unauthorized: Invalid token" });
        }

        const article = await Article.find(id);
        if (!article) {
            return res.status(404).json({ error: "Article not found" });
        }
        if (decodedToken.username !== article.author) {
            return res.status(403).json({ error: "Forbidden: You are not authorized to update this article" });
        }
        const updateArticle = await Article.findByIdAndUpdate(id)
        res.send("Your article was updated")
    } catch(err){
        console.error(err);
        res.status(500).send("Failed to update article");
    }
}

const deleteArticle = async (req, res) => {
    const { id } = req.params
    const token = req.headers.authorization;
    
    if (!token) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }
    try{
        const decodedToken = jwt.verify(token, process.env.TOCEN_SECRET);
      
        if (!decodedToken) {
            return res.status(401).json({ error: "Unauthorized: Invalid token" });
        }

        const article = await Article.find(id);
        if (!article) {
            return res.status(404).json({ error: "Article not found" });
        }
        if (decodedToken.username !== article.author) {
            return res.status(403).json({ error: "Forbidden: You are not authorized to delete this article" });
        }
        const deleteArticle = await Article.findByIdAndDelete(id)
        res.send("Article deleted successfuly")
    } catch(err){
        console.error(err)
        res.status(500).send("Failed to delete article")
    }
}

const leaveComment = async (req, res) => {
    const { articleId } = req.params;  
    const { content } = req.body;  
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }
    
    try {
        const decodedToken = jwt.verify(token, process.env.TOCEN_SECRET);
      
        if (!decodedToken) {
            return res.status(401).json({ error: "Unauthorized: Invalid token" });
        }

        const article = await Article.find(articleId);
        if (!article) {
            return res.status(404).json({ error: "Article not found" });
        }

        const newComment = {
            _id: article[0].id + decodedToken.username,
            content,
            author: decodedToken.username,
            createdTime: Date.now(),
        };
        article[0].comments.push(newComment);

        await article[0].save();

        return res.json({ status: "Comment added", article });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
};
const deleteComment = async (req, res) => {
    const { articleId } = req.params;
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.TOCEN_SECRET);

        if (!decodedToken) {
            return res.status(401).json({ error: "Unauthorized: Invalid token" });
        }

        const article = await Article.findById(articleId);

        if (!article) {
            return res.status(404).json({ error: "Article not found" });
        }

        const commentToDeleteIndex = article.comments.findIndex(comment => {
            if(comment.author !== decodedToken.username) return res.status(403).send(`Dear ${decodedToken.username} you can only delete your own comment`) 
            return comment.author === decodedToken.username;
        });

        if (commentToDeleteIndex === -1) {
            return res.status(404).json({ error: "Comment not found" });
        }

        article.comments.splice(commentToDeleteIndex, 1);

        await article.save();

        return res.json({ status: "Comment deleted", article });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
};




export { createArticle, getAllArticles, getAllArticleById, updateArticle, deleteArticle, leaveComment, deleteComment};
