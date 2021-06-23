# CateringManagementSystem

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:8082/`. The app will automatically reload if you change any of the source files.

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

## Frondend

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Launch
Run `ng serve`

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Backend (API)

### Launch
Run `npm run startdemon`
