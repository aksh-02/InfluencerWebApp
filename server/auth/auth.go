package auth

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/aksh-02/Influencers/server/models"
	"github.com/dgrijalva/jwt-go"
	"go.mongodb.org/mongo-driver/bson"
)

var jwtSecretKey = []byte(os.Getenv("INFLUENCER_JWT_SECRET_KEY"))
var allowOrigin = "http://localhost:3000"

func generateToken(username string, mins int) (http.Cookie, error) {
	expirationTime := time.Now().Add(time.Duration(mins) * time.Minute)
	claims := &Claims{
		Username: username,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtSecretKey)
	if err != nil {
		return http.Cookie{}, err
	}

	return http.Cookie{
		Name:    "token",
		Value:   tokenString,
		Expires: expirationTime,
	}, nil
}

func SignUp(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", allowOrigin)
	w.Header().Set("Access-Control-Allow-Credentials", "true")

	var user models.User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		log.Fatal(err)
	}

	var tempUser models.User
	if err := models.UsersCollection.FindOne(context.Background(), bson.M{"username": user.Username}).Decode(&tempUser); err == nil {
		fmt.Println("Username already exists")
		json.NewEncoder(w).Encode("Username already exists")
	} else {
		user.CreatedAt = time.Now()
		user.UpdatedAt = time.Now()
		insResp, err := models.UsersCollection.InsertOne(context.Background(), user)
		if err != nil {
			log.Fatal(err)
		}
		fmt.Println("Inserted a Single Record ", insResp.InsertedID)
		// json.NewEncoder(w).Encode(fmt.Sprintf("Congrats !! Account created for %v", user.Username))

		jwtCookie, err := generateToken(user.Username, 5)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		http.SetCookie(w, &jwtCookie)
	}
}

type Credentials struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type Claims struct {
	Username string `json:"username"`
	jwt.StandardClaims
}

func SignIn(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", allowOrigin)
	w.Header().Set("Access-Control-Allow-Credentials", "true")

	var creds Credentials
	err := json.NewDecoder(r.Body).Decode(&creds)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	var tempUser models.User
	if err := models.UsersCollection.FindOne(context.Background(), bson.M{"username": creds.Username, "password": creds.Password}).Decode(&tempUser); err != nil {
		fmt.Println("Username or Password is incorrect")
		json.NewEncoder(w).Encode("Username or Password is incorrect")
		return
	}

	fmt.Printf("Successful login for %v\n", creds.Username)

	jwtCookie, err := generateToken(creds.Username, 15) // reduce time
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	// Writing something to Responsewriter before setting the cookie doesn't set the cookie
	http.SetCookie(w, &jwtCookie)
}

func IsAuthorized(endpoint http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		c, err := r.Cookie("token")
		if err != nil {
			if err == http.ErrNoCookie {
				fmt.Printf("No Cookie found for %v\n", endpoint)
				w.WriteHeader(http.StatusUnauthorized)
				http.Redirect(w, r, "/signin", http.StatusSeeOther)
				return
			}
			w.WriteHeader(http.StatusBadRequest)
			fmt.Println("Bad Request")
			return
		}

		tokenString := c.Value
		claims := &Claims{}

		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return jwtSecretKey, nil
		})
		if err != nil {
			if err == jwt.ErrSignatureInvalid {
				fmt.Println("Unauthorized")
				w.WriteHeader(http.StatusUnauthorized)
				http.Redirect(w, r, "/signin", http.StatusSeeOther)
				return
			}
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		if !token.Valid {
			fmt.Println("Unauthorized")
			w.WriteHeader(http.StatusUnauthorized)
			http.Redirect(w, r, "/signin", http.StatusSeeOther)
			return
		}
		endpoint(w, r)
	})
}

func Logout(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", allowOrigin)
	w.Header().Set("Access-Control-Allow-Credentials", "true")

	c, err := r.Cookie("token")
	if err != nil {
		if err == http.ErrNoCookie {
			fmt.Printf("No Cookie found. You are not logged in")
			w.WriteHeader(http.StatusUnauthorized)
			http.Redirect(w, r, "/signin", http.StatusSeeOther)
			return
		}
		w.WriteHeader(http.StatusBadRequest)
		fmt.Println("Bad Request")
		return
	}

	tokenString := c.Value
	claims := &Claims{}

	_, err = jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtSecretKey, nil
	})
	if err != nil {
		if err == jwt.ErrSignatureInvalid {
			fmt.Println("Unauthorized")
			w.WriteHeader(http.StatusUnauthorized)
			http.Redirect(w, r, "/signin", http.StatusSeeOther)
			return
		}
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	fmt.Printf("Logging out for %v", claims.Username)

	jwtCookie, err := generateToken(claims.Username, -5)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	http.SetCookie(w, &jwtCookie)
}

func ApplyAsInfluencer(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", allowOrigin)

	var influencer models.Influencer
	err := json.NewDecoder(r.Body).Decode(&influencer)
	if err != nil {
		log.Fatal(err)
	}

	var tempInfluencer models.Influencer
	if err := models.InfluencersCollection.FindOne(context.Background(), bson.M{"username": influencer.Username}).Decode(&tempInfluencer); err == nil {
		fmt.Println("Already applied as an Influencer")
		json.NewEncoder(w).Encode("You've already applied as an Influencer")
	} else {
		insResp, err := models.InfluencersCollection.InsertOne(context.Background(), influencer)
		if err != nil {
			log.Fatal(err)
		}
		fmt.Println("Inserted a Single Record ", insResp.InsertedID)
		json.NewEncoder(w).Encode("You've successfully applied as an Influencer")
	}

}

func InfluencerPic(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", allowOrigin)

	r.ParseMultipartForm(10 << 20)
	pictureFile, _, err := r.FormFile("influencerPic")
	if err != nil {
		fmt.Println("In InfluencerPic", err)
		return
	}

	defer pictureFile.Close()

	// create a temporary file with a random name
	tempFile, err := ioutil.TempFile("../client/public/influencerPictures", "*.png")
	if err != nil {
		fmt.Println(err)
	}
	defer tempFile.Close()

	// read all of the contents of our uploaded file into a byte array
	fileBytes, err := ioutil.ReadAll(pictureFile)
	if err != nil {
		fmt.Println(err)
	}

	// write this byte array to our temporary file
	tempFile.Write(fileBytes)

	// read userData to access username
	userDataFile, _, err := r.FormFile("userData")
	if err != nil {
		fmt.Println("In InfluencerPic Accessing userData", err)
		return
	}

	defer userDataFile.Close()

	fileBytes, err = ioutil.ReadAll(userDataFile)
	if err != nil {
		fmt.Println("In InfluencerPic Reading userData", err)
	}

	var userData map[string]string
	err = json.Unmarshal(fileBytes, &userData)
	if err != nil {
		fmt.Println("In InfluencerPic Unmarshalling userData", err)
	}

	fmt.Println(string(fileBytes), userData["username"], tempFile.Name())

	filter := bson.M{"username": userData["username"]}
	update := bson.M{"$set": bson.M{"profilePicture": tempFile.Name()}}
	updResp, err := models.InfluencersCollection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Influencers updated: ", updResp.ModifiedCount)

	json.NewEncoder(w).Encode("InfluencerPic uploaded Successfully.")
}

func TestPoint(w http.ResponseWriter, r *http.Request) {
	fmt.Println("In ok")
	w.Header().Set("Access-Control-Allow-Origin", allowOrigin)
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	json.NewEncoder(w).Encode("Page Ok")
}
