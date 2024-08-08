package models

import "transaction-be/src/configs"

type TransactionDetail struct {
	Price           float64     `json:"price"`
	Quantity        int         `json:"quantity" validate:"min=1"`
	DiscountPercent float64     `json:"discount_percent" `
	DiscountAmount  float64     `json:"discount_amount"`
	DiscountPrice   float64     `json:"discount_price"`
	TotalPrice      float64     `json:"total_price"`
	TransactionID   int         `json:"transaction_id" validate:"required"`
	Transaction     Transaction `gorm:"foreignKey:TransactionID"`
	ProductID       int         `json:"product_id" validate:"required"`
	Product         Product     `gorm:"foreignKey:ProductID"`
}

func CreateTransactionDetail(data *TransactionDetail) error {
	result := configs.DB.Create(data)
	return result.Error
}
