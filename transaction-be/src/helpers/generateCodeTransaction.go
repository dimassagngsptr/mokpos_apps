package helpers

import (
	"fmt"
	"time"
	"transaction-be/src/models"
)

func GenerateTransactionCode() (string, error) {
	res := models.GetAll()
	var newID int
	fmt.Println(len(res))
	if len(res) < 0 {
		newID = 1
	} else {
		newID = len(res) + 1
	}
	currentTime := time.Now()
	year := currentTime.Format("2006")
	month := currentTime.Format("01")

	code := fmt.Sprintf("%s%s-%04d", year, month, newID)

	return code, nil
}
