package middlewares

import (
	"github.com/microcosm-cc/bluemonday"
)

func XSSMiddleware(data map[string]interface{}) map[string]interface{} {
	policy := bluemonday.UGCPolicy()
	for key, value := range data {
		if str, ok := value.(string); ok {
			data[key] = policy.Sanitize(str)
		}
	}
	return data
}
