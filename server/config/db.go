package config

import (
	"context"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var DB *mongo.Database

func ConnectDB() {
	client, err := mongo.NewClient(
		options.Client().ApplyURI(os.Getenv("MONGO_URI")),
	)
	if err != nil {
		log.Fatal(err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err = client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}

	// IMPORTANT: this creates reference to DB
	DB = client.Database("guvi_task_manager")

	log.Println("MongoDB connected to database: guvi_task_manager")
}
