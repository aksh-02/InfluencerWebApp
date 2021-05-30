package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/aksh-02/Influencers/server/models"
	"github.com/aksh-02/Influencers/server/router"
)

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	Client, err := models.GetDbClient(ctx)
	if err != nil {
		fmt.Printf("Some error in database connection %v\n", err)
	}
	defer func() {
		if err := Client.Disconnect(ctx); err != nil {
			panic(err)
		}
	}()

	r := router.Router()
	fmt.Println("Started server on the port 8080...")
	log.Fatal(http.ListenAndServe("localhost:8080", r))
}
