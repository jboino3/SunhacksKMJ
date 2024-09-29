data "aws_ami" "debian" {
    most_recent = true
    owners = ["136693071363"]

    filter {
        name = "name"
        values = ["debian-11-amd64-*"]
    }

    filter {
        name = "virtualization-type"
        values = ["hvm"]
    }
}

resource "aws_spot_instance_request" "cheap_worker" {
    ami = data.aws_ami.debian.id
    instance_type = "t3.micro"
}