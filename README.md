# ExpresJS/MongoDB Blog App

## Description

This project was built using Node.js, Express.js and MongoDB. This is the backend of a blog app project.

## Technologies and liberies

* Node.js
* Express.js
* MongoDB
* Mongoose

## Features

* User registration and login
* Authentication via JWT
* CRUD for users and articles
* MongoDB database

### Installing

```
git clone https://github.com/NarekQolozyan/Blog_App.git
cd BLOG_PROJECT
npm install
```

## Getting Started

To test the application

* Download MongoDB and Postman in your pc.

```
nodemon server.js

```
* Register as user via http://localhost:5500/register with username, email, password and age in the body as JSON format via Postman or any alternatives,  if successful, you should see a massage.
* Login as user via http://localhost:5500/login with the same username and password, if everything was successul, you should see a message.
* If you want to see all users, use http://localhost:5500/users URL via Postman or any altenatives.
* If you want to see only one profil of user, use http//localhost:5500/users/(your id/someone else's id)
* If you want to update your own profil use http://localhost/5500/users/update/(your id) URL via Postman or any alternatives.
* if you want to delete your own profile, use http://localhost/users/delete/(your Id) via Postman or any alternatives.



* Create an article via  http://localhost:5500/createArticle/:userId with title and content in the body as JSON format via Postman or any alternatives.
* For looking all articles use http://localhost:5500/articles URL via Postman or any alternatives.
* If you want to see only one article, you can use http://localhost:5500/articles/articleId URL for it.
* To update one of your articles use http://localhost:5500/articles/updateArticle/(your_id) URL via Postman or any alternatives.
* To delete one of your articles use http://localhost:5500/deleteArticle/(your_id) URL via Postman or any alternatives.
* If you want to comment any article use http://localhost:5500/comment/(that article id) URL via Postman or any alternatives. 
* If you want delete you own comment, use http://localhost:5500/articles/(article_id)/comments URL via Postman or any alternatives.