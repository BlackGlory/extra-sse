# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.3.0](https://github.com/BlackGlory/extra-sse/compare/v0.2.1...v0.3.0) (2023-06-09)


### ⚠ BREAKING CHANGES

* **fetchEvents:** Changed the signature of `fetchEvents`

### Bug Fixes

* **fetchEvents:** change `Request` to `Getter<Request>` for support automatic reconnection ([fadfd0c](https://github.com/BlackGlory/extra-sse/commit/fadfd0ccedee40eb88a311ef4acaa5cb89528483))

### [0.2.1](https://github.com/BlackGlory/extra-sse/compare/v0.2.0...v0.2.1) (2023-06-09)


### Bug Fixes

* export src ([462b691](https://github.com/BlackGlory/extra-sse/commit/462b691f1fa9a9bb95b465023bbbf24233bb7014))
* **parser:** json ([d7990cf](https://github.com/BlackGlory/extra-sse/commit/d7990cf0d30713606e7fbff7fd26ade179383362))

## [0.2.0](https://github.com/BlackGlory/extra-sse/compare/v0.1.0...v0.2.0) (2023-06-09)


### ⚠ BREAKING CHANGES

* **fetch-events:** Removed `options.signal` because it can be easily replaced by
`Request.signal`

* **fetch-events:** the first argument now accept more types ([d77eec1](https://github.com/BlackGlory/extra-sse/commit/d77eec1821b636669f4783bd8dcb8467efaec52c))

## 0.1.0 (2023-05-04)


### Features

* init ([ddda148](https://github.com/BlackGlory/extra-sse/commit/ddda1482bc75a6eecab9a8e997e04c8ddc611686))
