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
	task.CreatedAt = time.Now()

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	config.DB.Collection("tasks").InsertOne(ctx, task)
	c.JSON(http.StatusCreated, gin.H{"message": "Task created"})
}


func GetTasks(c *gin.Context) {
	userId := c.GetString("userId")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := config.DB.Collection("tasks").
		Find(ctx, bson.M{"userId": userId})
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to fetch tasks"})
		return
	}

	var tasks []models.Task
if err := cursor.All(ctx, &tasks); err != nil {
	c.JSON(500, gin.H{"error": "Failed to decode tasks"})
	return
}

if tasks == nil {
	tasks = []models.Task{}
}

c.JSON(http.StatusOK, tasks)
}


func UpdateTask(c *gin.Context) {
	id := c.Param("id")
	userId := c.GetString("userId")

	taskId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid task ID"})
		return
	}

	var task models.Task
	c.ShouldBindJSON(&task)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Build update document with only non-empty fields
	updateFields := bson.M{}
	if task.Title != "" {
		updateFields["title"] = task.Title
	}
	if task.Description != "" {
		updateFields["description"] = task.Description
	}
	if task.Status != "" {
		updateFields["status"] = task.Status
	}

	if len(updateFields) == 0 {
		c.JSON(400, gin.H{"error": "No fields to update"})
		return
	}

	res, err := config.DB.Collection("tasks").UpdateOne(
		ctx,
		bson.M{"_id": taskId, "userId": userId},
		bson.M{"$set": updateFields},
	)

	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to update task"})
		return
	}

	if res.MatchedCount == 0 {
		c.JSON(403, gin.H{"error": "Not authorized"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Task updated"})
}


func DeleteTask(c *gin.Context) {
	id := c.Param("id")
	userId := c.GetString("userId")

	taskId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid task ID"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	res, _ := config.DB.Collection("tasks").
		DeleteOne(ctx, bson.M{"_id": taskId, "userId": userId})

	if res.DeletedCount == 0 {
		c.JSON(403, gin.H{"error": "Not authorized"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Task deleted"})
}

