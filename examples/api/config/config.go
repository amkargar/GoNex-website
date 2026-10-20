package config

import (
	"github.com/amkargar/gonex/config"
	"os"
)

func Load() config.Config {
	address := os.Getenv("HTTP_ADDRESS")

	return config.Config{Name: os.Getenv("APP_NAME"), Environment: os.Getenv("GONEX_ENV"), LogLevel: os.Getenv("GONEX_LOG_LEVEL"), LogFormat: os.Getenv("GONEX_LOG_FORMAT"), LogColor: os.Getenv("GONEX_LOG_COLOR"), Address: address, DisableHTTP: os.Getenv("GONEX_DISABLE_HTTP") == "1", DisableOpenAPI: os.Getenv("GONEX_DISABLE_OPENAPI") == "1"}
}
