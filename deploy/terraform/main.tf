terraform {
  cloud {
    organization = "blackhive"

    workspaces {
      name = "catering-management-system-web"
    }
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.47.0"
    }
    tfe = {
      version = "~> 0.38.0"
    }
  }

  required_version = ">= 1.1.0"
}

provider "aws" {
  region = "eu-west-1"
}
