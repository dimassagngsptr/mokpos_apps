package helpers

import (
	"fmt"
)

func GenerateNextProductCode(categoryCode string, currentCount int) string {
	// Tambahkan 1 ke jumlah produk saat ini
	nextNumber := currentCount + 1
	// Format menjadi 3 digit
	return fmt.Sprintf("%s%03d", categoryCode, nextNumber)
}