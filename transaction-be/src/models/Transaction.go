package models

import (
	"time"
	"transaction-be/src/configs"

	"gorm.io/gorm"
)

type Transaction struct {
	gorm.Model
	Code          string              `gorm:"unique,not null" json:"code" validate:"required,max=10"`
	Date          time.Time           `json:"date" validate:"required"`
	Subtotal      float64             `json:"subtotal" validate:"required"`
	Discount      float64             `json:"discount"`
	ShippingPrice float64             `json:"shipping_price"`
	TotalPayment  float64             `json:"total_payment"`
	CustomerID    int                 `json:"customer_id" validate:"required"`
	Customer      Customer            `gorm:"foreignKey:CustomerID"`
	Detail        []TransactionDetail `json:"detail"`
}

func GetAllTransaction(code, sort string) []*Transaction {
	var items []*Transaction
	code = "%" + code + "%"
	configs.DB.Preload("Customer").Preload("Detail").Order(sort).Where("code ILIKE ?", code).Find(&items)
	return items
}
func GetAll() []*Transaction{
	var items []*Transaction
	configs.DB.Preload("Customer").Preload("Detail").Find(&items)
	return items
}
func CreateTransaction(data *Transaction) (*Transaction, error) {
	results := configs.DB.Create(&data)
	if results.Error != nil {
		return nil, results.Error
	}
	return data, nil
}

func GetLastTransaction(transaction *Transaction) error {
	result := configs.DB.Order("ID desc").First(transaction)
	return result.Error
}
