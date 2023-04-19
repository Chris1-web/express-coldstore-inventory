# express-coldstore-inventory

## Description

Express Coldstore Inventory is an inventory management app made with NodeJs, Express, and MongoDB for an imaginary coldroom listing food items that can be freezed. With this app, visitors can create, read, update and delete categories of food items.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You will need to have Node.js and npm (Node Package Manager) installed on your machine. You can download and install them from the official website (https://nodejs.org/en/). You would also need knowledge of Express and MongoDB.

### Installing

1. Clone the repository to your local machine

```
git clone https://github.com/Chris1-web/express-coldstore-inventory.git
```

2. Install NPM Packages

```
npm install
```

3. Create a .env file in the root directory of the project and add the following environment variables:
   MONGO_DB_ATLAS_URI - MongoDB Atlas connection string OR MONGO_DB_LOCAL_URI - MongoDB local connection string (if you want to use local MongoDB instance, BUT you need to have MongoDB installed on your machine and running, Also you need to change the name where MONGO_DB_ATLAS_URI is used)

4. Populate the database

```
npm run populate
```

5. Run the app

```
npm run devstart
```

6. Run the tailwindcss

```
npm run tailwindstart
```

The application would start at http://localhost:3000

<!-- https://blogs.yasharyan.com/store-images-on-mongodb ---- store image on MONGO DB

I spent hours looking for how to implement filter in items page

https://stackoverflow.com/questions/8698534/how-to-pass-variable-from-jade-template-file-to-a-script-file

https://github.com/expressjs/multer ---- multer documentary but limited for my current use -->
