#!/usr/bin/env bash
set -e # halt script on error

bundle update
bundle exec jekyll serve
