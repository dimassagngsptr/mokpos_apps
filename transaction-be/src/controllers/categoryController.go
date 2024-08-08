package controllers

import (
	"transaction-be/src/helpers"
	"transaction-be/src/middlewares"
	"transaction-be/src/models"

	"github.com/gofiber/fiber/v2"
	"github.com/mitchellh/mapstructure"
)

func GetAllCategories(c *fiber.Ctx) error {
	categories := models.GetAllCategory()
	if len(categories) < 1 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message":    "Data not found",
			"statusCode": fiber.StatusNotFound,
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Success get all data",
		"data":    categories,
	})
}

func CreateCategory(c *fiber.Ctx) error {
	var input map[string]interface{}
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message":    "Invalid request body",
			"statusCode": fiber.StatusBadRequest,
		})
	}
	input = middlewares.XSSMiddleware(input)
	var newCategory models.Category
	if err := mapstructure.Decode(input, &newCategory); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Internal server error",
		})
	}

	errors := helpers.ValidateStruct(newCategory)
	if len(errors) > 0 {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(errors)
	}
	created, err := models.CreateCategory(&newCategory)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to create category",
			"err":     err,
		})

	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Successfully created category",
		"data":    created,
	})
}