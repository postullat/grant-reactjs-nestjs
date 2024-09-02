### Requirements:
1. Docker v27.*

### How to start the app with Docker
1. Open cmd or terminal
2. Type `docker-compose up --build`
3. in a few minutes (once docker builds images and starts containers) the app will be accessible at:

frontend - http://localhost:3000

backend - http://localhost:4000

if those ports are in use on your machine then please change them in docker-compose.yml

### Run tests
`npm run test` on nestjs project

### What can be improved
1. frontend UI (styles, pagination)
2. NestJs payload validation approach (DTO, Validation Pipe, etc)
