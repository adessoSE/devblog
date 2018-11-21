#!/usr/bin/env bash
set -e # halt script on error

gem install bundler -v 1.17
bundle exec jekyll build
