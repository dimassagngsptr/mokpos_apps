package helpers

import (
	"crypto/sha1"
	"encoding/base64"
	"strings"

	"github.com/google/uuid"
)

func GenerateShortUUID() string {
	u := uuid.New()

	hasher := sha1.New()
	hasher.Write([]byte(u.String()))
	sha := base64.URLEncoding.EncodeToString(hasher.Sum(nil))

	return strings.TrimRight(sha, "=")[:10]
}
