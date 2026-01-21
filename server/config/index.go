package config

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func CreateUserIndex() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	index := mongo.IndexModel{
		Keys: bson.M{"email": 1},
		Options: options.Index().SetUnique(true),
	}

	_, err := DB.Collection("users").Indexes().CreateOne(ctx, index)
	if err != nil {
		log.Fatal("User index error:", err)
	}
}
