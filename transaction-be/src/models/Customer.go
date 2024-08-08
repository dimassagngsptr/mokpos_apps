package models

import (
	"transaction-be/src/configs"

	"gorm.io/gorm"
)

type Customer struct {
	gorm.Model
	Code        string        `json:"code"`
	Name        string        `json:"name" validate:"required"`
	Phone       string        `json:"phone" validate:"required,max=20,min=10"`
	Transaction []Transaction `json:"transaction"`
}

func GetAllCustomer() []*Customer {
	var items []*Customer
	configs.DB.Find(&items)
	return items
}

func CreateCustomer(data *Customer) (*Customer, error) {
	results := configs.DB.Create(&data)
	if results.Error != nil {
		return nil, results.Error
	}
	return data, nil
}
