variable "aws_region" {
  description = "Aws region"
  type        = string
  default     = "ca-central-1"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "project_visibility" {
  description = "Visibility configuration for the github repository."
  type        = string
  default     = "public"
}

variable "repo_url" {
  description = "url of the repository"
  type        = string
}
