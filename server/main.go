package main

import (
	"os"
	"time"

	"taskmanager/config"
	"taskmanager/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()

	r := gin.Default()
r.Use(cors.New(cors.Config{
		AllowOrigins:     true,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:   []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:          12 * time.Hour,
	}))
	config.ConnectDB()
	config.CreateUserIndex()

	routes.AuthRoutes(r)
	routes.TaskRoutes(r)

	r.Run(":" + os.Getenv("PORT"))
}
