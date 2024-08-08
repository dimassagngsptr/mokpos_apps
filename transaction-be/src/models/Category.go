package models

import (
	"transaction-be/src/configs"

	"gorm.io/gorm"
)

type Category struct {
	gorm.Model
	Code    string    `json:"code"`
	Name    string    `json:"name"`
	Product []Product `json:"product"`
}

func GetAllCategory() []*Category {
	var items []*Category
	configs.DB.Find(&items)
	return items
}

func CreateCategory(data *Category) (*Category, error) {
	results := configs.DB.Create(&data)
	if results.Error != nil {
		return nil, results.Error
	}
	return data, nil
}

func GetCategoryByID(categoryID uint) (Category, error) {
	var category Category
	err := configs.DB.First(&category, "id = ?", categoryID).Error
	return category, err
}
