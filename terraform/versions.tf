terraform {
    required_version = "1.6.5"

    backend "local" {
        path = "./terraform.tfstate"
    }

    required_providers {
        null = {
            source = "hashicorp/null"
            version = "3.2.2"
        }
    }
}

provider "null" {}