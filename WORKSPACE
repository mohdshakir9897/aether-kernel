workspace(name = "aether_ui")

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

# Hermetic Node.js / TypeScript rules
http_archive(
    name = "aspect_rules_ts",
    sha256 = "c082725eef7253597816f0e47c1b5ff8c2ef48df895d52ad693cf762b60a3a41",
    strip_prefix = "rules_ts-2.2.0",
    url = "https://github.com/aspect-build/rules_ts/releases/download/v2.2.0/rules_ts-v2.2.0.tar.gz",
)

http_archive(
    name = "aspect_rules_js",
    sha256 = "2941fa44da3e9e3be217a6a427ecff6992be7e076df3d1ee417dc46221f7c327",
    strip_prefix = "rules_js-1.38.0",
    url = "https://github.com/aspect-build/rules_js/releases/download/v1.38.0/rules_js-v1.38.0.tar.gz",
)
