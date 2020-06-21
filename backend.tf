terraform {
  backend "s3" {
    bucket         = "martinbjeldbak-terraform-state"
    key            = "martinbjeldbak.com/terraform.tfstate"
    region         = "ap-southeast-2"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}
