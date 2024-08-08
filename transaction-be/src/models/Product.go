package models

import (
	"transaction-be/src/configs"

	"gorm.io/gorm"
)

type Product struct {
	gorm.Model
	Code       string              `json:"code"`
	Image      string              `json:"image"`
	Name       string              `json:"name" validate:"required"`
	Price      float64             `json:"price" validate:"required"`
	Discount   float64             `json:"discount"`
	CategoryID int                 `json:"category_id"`
	Category   Category            `gorm:"foreignKey:CategoryID"`
	Detail     []TransactionDetail `json:"detail"`
}

func GetAllProducts(sort, name string, limit, offset int) []*Product {
	var items []*Product
	name = "%" + name + "%"
	configs.DB.Preload("Category").Order(sort).Limit(limit).Offset(offset).Where("name ILIKE ?", name).Find(&items)
	return items
}

func CreateProduct(data *Product) (*Product, error) {
	results := configs.DB.Create(&data)
	if results.Error != nil {
		return nil, results.Error
	}
	return data, nil
}

func GetProductCountByCategory(categoryID uint) (int, error) {
	var count int64
	err := configs.DB.Model(&Product{}).Where("category_id = ?", categoryID).Count(&count).Error
	return int(count), err
}

func UpdateProduct(id int, item *Product) error {
	result := configs.DB.Model(&Product{}).Where("id = ?", id).Updates(item)
	return result.Error
}
func DeleteProduct(id int) error {
	result := configs.DB.Delete(&Product{}, "id = ?", id)
	return result.Error
}