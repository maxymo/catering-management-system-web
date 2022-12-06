# CateringManagementSystem

NodeJS: 16.13.2
Angular: 15.0.0

## Getting Started

Follow these steps to run this app locally

- Create a free mongoose database (https://www.mongodb.com/).
- Create nodemon.json file inside "api" folder with the following environment constants (replace its values with the correct for your environment)

```json
{
  "env": {
    "MONGO_ATLAS_CONNECTION_STRING": "mongodb+srv://nodeuser:XXXXXXXXX@xxxxxx.mongodb.net/xxxxxxx?w=majority",
    "JWT_SECRET": "secret this should be longer"
  }
}
```

## Backend (API)

### Launch
Run `npm run startdemon`

## Frondend

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Launch
Run `ng serve --open`

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
