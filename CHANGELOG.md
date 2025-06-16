# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.5.0](https://github.com/BlackGlory/extra-sse/compare/v0.4.0...v0.5.0) (2025-06-16)


### ⚠ BREAKING CHANGES

* The module requires `extra-fetch@^5.0.1`

* upgrade dependencies ([bd14db6](https://github.com/BlackGlory/extra-sse/commit/bd14db6fd8fdee76225d94cdf0b0209cf60e474e))

## [0.4.0](https://github.com/BlackGlory/extra-sse/compare/v0.3.3...v0.4.0) (2025-05-25)


### ⚠ BREAKING CHANGES

* Node.js v16 => Node.js v22

* upgrade dependencies ([eb23a24](https://github.com/BlackGlory/extra-sse/commit/eb23a24b4a145f0f2c334ea63baf30a6ce71fd45))

### [0.3.3](https://github.com/BlackGlory/extra-sse/compare/v0.3.2...v0.3.3) (2025-05-25)


### Bug Fixes

* parser ([ed024ee](https://github.com/BlackGlory/extra-sse/commit/ed024ee63a4155f461fec7596059aab4eb35d980))

### [0.3.2](https://github.com/BlackGlory/extra-sse/compare/v0.3.1...v0.3.2) (2024-12-23)


### Bug Fixes

* regex ([29ca462](https://github.com/BlackGlory/extra-sse/commit/29ca462c99cabba28b22a61b54d14e117d0629e1))
* regex ([25ed834](https://github.com/BlackGlory/extra-sse/commit/25ed8347ebd444a4496caf87aaf00e29fe4cc89a))

### [0.3.1](https://github.com/BlackGlory/extra-sse/compare/v0.3.0...v0.3.1) (2023-08-02)


### Features

* add `options.onOpen` ([009d848](https://github.com/BlackGlory/extra-sse/commit/009d848a8fbe34f66961d8d752ae6d72af444914))

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
