package routes

import (
	"transaction-be/src/controllers"

	"github.com/gofiber/fiber/v2"
)

func Router(app *fiber.App) {
	app.Get("/", func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"info":    "Hello, wellcome to the API.😊",
			"message": "Server is running.",
		})
	})
	api := app.Group("/v1")
	api.Get("/customers", controllers.GetAllCustomers)
	api.Post("/customers", controllers.CreateCustomer)

	api.Get("/categories", controllers.GetAllCategories)
	api.Post("/categories", controllers.CreateCategory)

	api.Get("/products", controllers.GetAllProducts)
	api.Post("/products", controllers.CreateProduct)
	api.Post("/products/images", controllers.UploadFileServer)
	api.Put("/products/:id", controllers.UpdateProduct)
	api.Delete("/products/:id", controllers.DeleteProduct)

	api.Get("/transactions", controllers.GetAllTransaction)
	api.Post("/transactions", controllers.CreateTransaction)
}
