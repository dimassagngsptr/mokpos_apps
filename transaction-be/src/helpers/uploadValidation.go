package helpers

import (
	"net/http"

	"github.com/gofiber/fiber/v2"
)

func SizeUploadValidation(fileSize int64, maxFileSize int64) error {
	if fileSize > maxFileSize {
		return fiber.NewError(fiber.StatusRequestEntityTooLarge, "File size exceeds 2MB")
	}
	return nil
}

func TypeUploadValidation(buffer []byte, validFileTypes []string) error {
	fileType := http.DetectContentType(buffer)
	if !isValidFileType(validFileTypes, fileType) {
		return fiber.NewError(fiber.StatusBadRequest, "The file type is invalid. Only png, jpg, jpeg, and pdf are allowed.")
	}
	return nil
}

func isValidFileType(validFileTypes []string, fileType string) bool {
	for _, validType := range validFileTypes {
		if validType == fileType {
			return true
		}
	}
	return false
}
