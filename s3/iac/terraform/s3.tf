resource "aws_s3_bucket" "My-s3-bucket" {
  tags = {
    Name        = "My bucket"
    Environment = "Dev"
  }
}