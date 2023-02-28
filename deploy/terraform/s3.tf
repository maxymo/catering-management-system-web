locals {
  mime_types = jsondecode(file("${path.module}/data/mime.json"))
}

resource "aws_s3_bucket" "angular_app" {
  bucket = "${var.stage}-s3-cms-web"
}

resource "aws_s3_bucket_website_configuration" "angular_app" {
  bucket = aws_s3_bucket.angular_app.id

  index_document {
    suffix = "index.html"
  }
}

data "aws_canonical_user_id" "current" {}

resource "aws_s3_bucket_acl" "angular_app" {
  bucket = aws_s3_bucket.angular_app.id
  access_control_policy {
    owner {
      id = data.aws_canonical_user_id.current.id
    }
    grant {
      grantee {
        id   = data.aws_canonical_user_id.current.id
        type = "CanonicalUser"
      }
      permission = "FULL_CONTROL"
    }
    grant {
      grantee {
        type = "Group"
        uri  = "http://acs.amazonaws.com/groups/global/AllUsers"
      }
      permission = "READ_ACP"
    }
  }
}

#resource "aws_s3_object" "angular_app_files" {
#  bucket = aws_s3_bucket.angular_app.bucket
#  key    = "index.html"
#  source = "dist/catering-management-system-web/index.html"
#  content_type = "text/html"
#  acl = "public-read"
#}

resource "aws_s3_object" "angular_app_assets" {
  for_each = fileset("dist/catering-management-system-web/", "**/*")

  bucket = aws_s3_bucket.angular_app.bucket
  key    = each.value
  source = "dist/catering-management-system-web/${each.value}"
  etag   = filemd5("dist/catering-management-system-web/${each.value}")
  acl    = "public-read"
  content_type = lookup(local.mime_types, regex("\\.[^.]+$", each.value), null)
}
