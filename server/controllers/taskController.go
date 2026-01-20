package controllers

import (
	"context"
	"net/http"
	"time"

	"taskmanager/config"
	"taskmanager/models"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func CreateTask(c *gin.Context) {
	userId := c.GetString("userId")

	var task models.Task
	c.BindJSON(&task)

	task.UserID = userId
	task.Status = "todo"

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	config.DB.Collection("tasks").InsertOne(ctx, task)
	c.JSON(http.StatusCreated, gin.H{"message": "Task created"})
}

func GetTasks(c *gin.Context) {
	userId := c.GetString("userId")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, _ := config.DB.Collection("tasks").Find(ctx, bson.M{"userId": userId})

	var tasks []models.Task
	cursor.All(ctx, &tasks)

	c.JSON(http.StatusOK, tasks)
}

func UpdateTask(c *gin.Context) {
	id := c.Param("id")

	taskId, _ := primitive.ObjectIDFromHex(id)

	var task models.Task
	c.BindJSON(&task)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	config.DB.Collection("tasks").UpdateOne(
		ctx,
		bson.M{"_id": taskId},
		bson.M{"$set": bson.M{
			"title":       task.Title,
			"description": task.Description,
			"status":      task.Status,
		}},
	)

	c.JSON(http.StatusOK, gin.H{"message": "Task updated"})
}

func DeleteTask(c *gin.Context) {
	id := c.Param("id")
	taskId, _ := primitive.ObjectIDFromHex(id)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	config.DB.Collection("tasks").DeleteOne(ctx, bson.M{"_id": taskId})
	c.JSON(http.StatusOK, gin.H{"message": "Task deleted"})
}
