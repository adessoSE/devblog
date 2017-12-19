#!/usr/bin/env bash
set -e # halt script on error

gem install bundler --pre
bundle exec jekyll build
