package controllers

import (
	"transaction-be/src/helpers"
	"transaction-be/src/middlewares"
	"transaction-be/src/models"

	"github.com/gofiber/fiber/v2"
	"github.com/mitchellh/mapstructure"
)

func GetAllCustomers(c *fiber.Ctx) error {
	customers := models.GetAllCustomer()
	if len(customers) < 1 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message":    "Data not found",
			"statusCode": fiber.StatusNotFound,
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Success get all data",
		"data":    customers,
	})
}

func CreateCustomer(c *fiber.Ctx) error {
	var input map[string]interface{}
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message":    "Invalid request body",
			"statusCode": fiber.StatusBadRequest,
		})
	}
	input = middlewares.XSSMiddleware(input)

	code := helpers.GenerateShortUUID()

	var newCustomer models.Customer
	if err := mapstructure.Decode(input, &newCustomer); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Internal server error",
		})
	}

	newCustomer.Code = code

	errors := helpers.ValidateStruct(newCustomer)
	if len(errors) > 0 {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(errors)
	}

	created, err := models.CreateCustomer(&newCustomer)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to create customer",
			"err":     err,
		})

	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Successfully created customer",
		"data":    created,
	})

}
