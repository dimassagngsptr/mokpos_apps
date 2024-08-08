package controllers

import (
	"fmt"
	"strconv"
	"strings"
	"transaction-be/src/helpers"
	"transaction-be/src/middlewares"
	"transaction-be/src/models"
	"transaction-be/src/services"

	"github.com/gofiber/fiber/v2"
	"github.com/mitchellh/mapstructure"
)

func GetAllProducts(c *fiber.Ctx) error {
	keyword := c.Query("search")
	pageOld := c.Query("page")
	limitOld := c.Query("limit")
	page, _ := strconv.Atoi(pageOld)
	limit, _ := strconv.Atoi(limitOld)
	sort := c.Query("sort")
	sortBy := c.Query("orderBy")
	if page == 0 {
		page = 1
	}
	if limit == 0 {
		limit = 5
	}
	offset := (page - 1) * limit
	if sort == "" {
		sort = "DESC"
	}
	if sortBy == "" {
		sortBy = "ID"
	}
	sort = sortBy + " " + strings.ToLower(sort)
	products := models.GetAllProducts(sort, keyword, limit, offset)
	if len(products) < 1 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message":    "Data not found",
			"statusCode": fiber.StatusNotFound,
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Success get all data",
		"data":    products,
	})
}

func CreateProduct(c *fiber.Ctx) error {
	var input map[string]interface{}
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message":    "Invalid request body",
			"statusCode": fiber.StatusBadRequest,
		})
	}

	input = middlewares.XSSMiddleware(input)
	var newProduct models.Product

	if err := mapstructure.Decode(input, &newProduct); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Internal server error",
		})
	}
	errors := helpers.ValidateStruct(newProduct)
	if len(errors) > 0 {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(errors)
	}

	categoryID, ok := input["category_id"].(float64)
	if !ok {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid category_id",
		})
	}
	categoryIDUint := uint(categoryID)

	category, err := models.GetCategoryByID(categoryIDUint)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to retrieve category",
			"err":     err,
		})
	}
	if category.ID == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Category not found",
		})
	}

	productCount, err := models.GetProductCountByCategory(categoryIDUint)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to count products by category",
			"err":     err,
		})
	}

	newCode := helpers.GenerateNextProductCode(category.Code, productCount)
	newProduct.Code = newCode

	newProduct = models.Product{
		Code:       newCode,
		Image:      newProduct.Image,
		Name:       newProduct.Name,
		Price:      newProduct.Price,
		CategoryID: int(category.ID),
		Discount:   float64(newProduct.Discount),
	}
	created, err := models.CreateProduct(&newProduct)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to create product",
			"err":     err,
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Successfully created product",
		"data":    created,
	})
}

func UploadFileServer(c *fiber.Ctx) error {
	file, err := c.FormFile("file")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).SendString("Failed uploaded file: " + err.Error())
	}

	maxFileSize := int64(2 << 20)
	if err := helpers.SizeUploadValidation(file.Size, maxFileSize); err != nil {
		return err
	}

	fileHeader, err := file.Open()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Failed opened file: " + err.Error())
	}
	defer fileHeader.Close()

	buffer := make([]byte, 512)
	if _, err := fileHeader.Read(buffer); err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Failed reading file: " + err.Error())
	}

	validFileTypes := []string{"image/png", "image/jpeg", "image/jpg"}
	if err := helpers.TypeUploadValidation(buffer, validFileTypes); err != nil {
		return err
	}

	uploadResult, err := services.UploadCloudinary(c, file)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}
	return c.JSON(uploadResult)
}

func UpdateProduct(c *fiber.Ctx) error {
	id, _ := strconv.Atoi(c.Params("id"))

	var updatedProduct models.Product
	if err := c.BodyParser(&updatedProduct); err != nil {
		c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid request body",
		})
		return err
	}

	err := models.UpdateProduct(id, &updatedProduct)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": fmt.Sprintf("Failed to update product"),
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": fmt.Sprintf("Product updated successfully"),
	})
}

func DeleteProduct(c *fiber.Ctx) error {
	id, _ := strconv.Atoi(c.Params("id"))
	err := models.DeleteProduct(id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": fmt.Sprintf("Failed to delete product "),
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": fmt.Sprintf("Product deleted successfully"),
	})
}