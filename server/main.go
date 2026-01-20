package main
import "github.com/joho/godotenv"

import (
	"os"
	"taskmanager/config"
	"taskmanager/routes"

	"github.com/gin-gonic/gin"
)

func main() {
		godotenv.Load()

	r := gin.Default()
	config.ConnectDB()

	routes.AuthRoutes(r)
	routes.TaskRoutes(r)


r.Run(":" + os.Getenv("PORT"))
}
