package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)
type Task struct {
	ID          primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Title       string             `json:"title"`
	Description string             `json:"description"`
	Status      string             `json:"status"`
	UserID      string               `bson:"userId" json:"userId"`
	CreatedAt   time.Time          `bson:"createdAt" json:"createdAt"`

}
