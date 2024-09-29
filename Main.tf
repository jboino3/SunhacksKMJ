terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.62.0"
    }
  }
}

provider "aws" {
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
  region     = var.aws_region
}

# VPC
resource "aws_vpc" "open_web_ui" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
}

# Subnet
resource "aws_subnet" "subnet" {
  cidr_block          = cidrsubnet(aws_vpc.open_web_ui.cidr_block, 3, 1)
  vpc_id              = aws_vpc.open_web_ui.id
  availability_zone   = "us-east-1a"
}

# Internet Gateway
resource "aws_internet_gateway" "open_web_ui" {
  vpc_id = aws_vpc.open_web_ui.id
}

# Route Table
resource "aws_route_table" "open_web_ui" {
  vpc_id = aws_vpc.open_web_ui.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.open_web_ui.id
  }
}

# Route Table Association
resource "aws_route_table_association" "open_web_ui" {
  subnet_id      = aws_subnet.subnet.id
  route_table_id = aws_route_table.open_web_ui.id
}

# Security Group
resource "aws_security_group" "ssh" {
  vpc_id = aws_vpc.open_web_ui.id

  ingress {
    cidr_blocks = ["0.0.0.0/0"]
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks  = ["0.0.0.0/0"]
  }
}

# Key Pair
resource "aws_key_pair" "open_web_ui" {
  key_name   = "open_web_ui"
  public_key = file("id_rsa.pub")  # Make sure to specify .pub for the public key
}

# Spot Instance
resource "aws_spot_instance_request" "open_web_ui" {
  ami                          = data.aws_ami.debian.id
  instance_type               = "t2.micro"
  associate_public_ip_address  = true
  key_name                    = aws_key_pair.open_web_ui.key_name
  vpc_security_group_ids      = [aws_security_group.ssh.id]
  subnet_id                   = aws_subnet.subnet.id
  wait_for_fulfillment        = true
}

# AMI Data Source
data "aws_ami" "debian" {
  most_recent = true
  owners      = ["136693071363"]

  filter {
    name   = "name"
    values = ["debian-11-amd64-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# Random String for S3 Bucket Name
resource "random_string" "unique_suffix" {
  length  = 8
  special = false
  upper   = false  # Ensures the string is lowercase
}

# S3 Bucket
resource "aws_s3_bucket" "website_bucket" {
   bucket = "collease-hackathon24-${random_string.unique_suffix.result}"
}

terraform {
    backend "s3" {
      bucket         = "collease-hackathon24-12345678"  # Replace with your actual bucket name
      key            = "terraform/state"  # This is the path within the bucket where the state file will be stored
      region         = "us-west-2"        # Replace with your bucket's region
    }
  }

resource "aws_s3_bucket_website_configuration" "website" {
  bucket = aws_s3_bucket.website_bucket.id

  index_document {
    suffix = "index.html"
  }
}

resource "aws_s3_bucket_public_access_block" "website_bucket_block" {
  bucket = aws_s3_bucket.website_bucket.id

  block_public_acls       = false
  ignore_public_acls      = false
  block_public_policy     = false
  restrict_public_buckets = false
}

# Upload Website Files to S3 Bucket
locals {
  # List of files you want to upload to S3
  website_files = fileset("${path.module}/build", "**/*")  # Ensure all files are included
}

resource "aws_s3_object" "website_files" {
  for_each = { for file in local.website_files : file => file }

  bucket = aws_s3_bucket.website_bucket.id
  key    = each.value   # This keeps the original structure intact
  source = "${path.module}/build/${each.value}"
}

resource "aws_s3_bucket_policy" "website_bucket_policy" {
  bucket = aws_s3_bucket.website_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action    = ["s3:GetObject"]
        Effect    = "Allow"
        Resource  = "${aws_s3_bucket.website_bucket.arn}/*"
        Principal = "*"
      }
    ]
  })
}


# Outputs
output "public_ip" {
  value = aws_spot_instance_request.open_web_ui.public_ip
}

output "s3_website_url" {
  value = "http://${aws_s3_bucket.website_bucket.id}.s3-website-${data.aws_region.current.name}.amazonaws.com/"
}

data "aws_region" "current" {}

# Variables
variable "aws_access_key" {}
variable "aws_secret_key" {}
variable "aws_region" {}
