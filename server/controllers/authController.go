package controllers

import (
	"context"
	"net/http"
	"time"

	"taskmanager/config"
	"taskmanager/models"
	"taskmanager/utils"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"golang.org/x/crypto/bcrypt"
	"go.mongodb.org/mongo-driver/mongo"

)

func Signup(c *gin.Context) {
	var user models.User

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(400, gin.H{"error": "Invalid input"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	hashed, err := bcrypt.GenerateFromPassword([]byte(user.Password), 10)
	if err != nil {
		c.JSON(500, gin.H{"error": "Password error"})
		return
	}
	user.Password = string(hashed)

	_, err = config.DB.Collection("users").InsertOne(ctx, user)
	if err != nil {
		// duplicate email error
		if mongo.IsDuplicateKeyError(err) {
			c.JSON(409, gin.H{"error": "Email already registered"})
			return
		}
		c.JSON(500, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User created"})
}


func Login(c *gin.Context) {
	var input models.User
	var user models.User

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"error": "Invalid input"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err := config.DB.Collection("users").
		FindOne(ctx, bson.M{"email": input.Email}).
		Decode(&user)

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	if err := bcrypt.CompareHashAndPassword(
		[]byte(user.Password),
		[]byte(input.Password),
	); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	token, err := utils.GenerateToken(user.ID.Hex())
	if err != nil {
		c.JSON(500, gin.H{"error": "Token error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token})
}

