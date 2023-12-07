resource "null_resource" "my_first_null" {
    provisioner "local-exec" {
        command = "echo hello world"
    }

    triggers = {
        only_when = "${timestamp()}"
    }
}