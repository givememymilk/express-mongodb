# Mock-express

My personal project for testing the water with express, mongodb, and backend web tech in general

## how to use it

This project requires postman and mongodb. Install those if you haven't

1. clone this repo
2. create a mongodb database
3. create an .env file with this content:
```sh
    MONGODB_URI=\<your mongodb contection\>
    JWT_SECRET=\<your jwt secret \>
```
4. run `npm ci`
5. follow the guide in `POSTMAN_GUIDE.md`