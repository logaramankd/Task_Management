package routes

import (
	"taskmanager/controllers"
	"taskmanager/middleware"

	"github.com/gin-gonic/gin"
)

func TaskRoutes(router *gin.Engine) {
	task := router.Group("/tasks")
	task.Use(middleware.AuthMiddleware())

	task.POST("/", controllers.CreateTask)
	task.GET("/", controllers.GetTasks)
	task.PUT("/:id", controllers.UpdateTask)
	task.DELETE("/:id", controllers.DeleteTask)
}
