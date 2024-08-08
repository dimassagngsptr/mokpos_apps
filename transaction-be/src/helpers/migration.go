package helpers

import (
	"transaction-be/src/configs"
	"transaction-be/src/models"
)

func Migration() {
	configs.DB.AutoMigrate(&models.Product{}, &models.Customer{}, &models.Transaction{}, &models.TransactionDetail{})
}
