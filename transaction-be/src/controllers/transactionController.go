package controllers

import (
	"strings"
	"time"
	"transaction-be/src/helpers"
	"transaction-be/src/models"

	"github.com/gofiber/fiber/v2"
)

type Detail struct {
	ID              int     `json:"id"`
	Name            string  `json:"name"`
	Image           string  `json:"image"`
	Price           float64 `json:"price"`
	Quantity        int     `json:"quantity"`
	DiscountPercent float64 `json:"discount_percent"`
	DiscountPrice   float64 `json:"discount_price"`
	TotalPrice      float64 `json:"total_price"`
}

type CreateTransactionInput struct {
	Subtotal        float64  `json:"subtotal"`
	ShippingFee     float64  `json:"shipping_fee"`
	DiscountPercent float64  `json:"discount_percent"`
	DiscountAmount  float64  `json:"discount_amount"`
	Details         []Detail `json:"details"`
	CustomerID      int      `json:"customer_id"`
}

func GetAllTransaction(c *fiber.Ctx) error {
	keyword := c.Query("code")
	sort := c.Query("sort")
	sortBy := c.Query("orderBy")
	if sort == "" {
		sort = "DESC"
	}
	if sortBy == "" {
		sortBy = "ID"
	}
	sort = sortBy + " " + strings.ToLower(sort)
	transaction := models.GetAllTransaction(keyword, sort)
	if len(transaction) < 1 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message":    "Data not found",
			"statusCode": fiber.StatusNotFound,
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Success get all data",
		"data":    transaction,
	})
}

func CreateTransaction(c *fiber.Ctx) error {
	var input CreateTransactionInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request format",
		})
	}

	code, err := helpers.GenerateTransactionCode()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to generate transaction code",
			"err":   err,
		})
	}

	transaction := models.Transaction{
		Code:          code,
		Date:          time.Now(),
		Subtotal:      input.Subtotal,
		Discount:      input.DiscountAmount,
		ShippingPrice: input.ShippingFee,
		TotalPayment:  input.Subtotal - input.DiscountAmount + input.ShippingFee,
		CustomerID:    input.CustomerID,
	}

	if _, err := models.CreateTransaction(&transaction); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create transaction",
		})
	}

	for _, detail := range input.Details {
		transactionDetail := models.TransactionDetail{
			Price:           detail.Price,
			Quantity:        detail.Quantity,
			DiscountPercent: detail.DiscountPercent,
			DiscountAmount:  detail.DiscountPrice,
			TotalPrice:      detail.TotalPrice,
			TransactionID:   int(transaction.ID),
			ProductID:       detail.ID,
		}
		if err := models.CreateTransactionDetail(&transactionDetail); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to create transaction detail",
			})
		}
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Transaction created successfully",
		"data":    transaction,
	})
}
