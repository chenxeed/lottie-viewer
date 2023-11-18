# Lottie Viewer

A small application that helps user to browser through their favourite LottieFiles, and be able to save and locate them in their device.

# Development Installation

Make sure you have Docker installed in your machine.

To run the application, run the docker compose

```
docker compose up -d --build
```

Make sure the database migration is running and the new tables are created in the Docker's PostgreSQL container.
If it doesn't, you may need to run the schema synchronization manually.

```
docker compose exec server sh

(inside the docker container)
(make sure you are in the /app directory)

npm run typeorm schema:sync
```


Once all the build has done, you can access the web app via `http://localhost:80/`.

For more information or assist, please contact me via chenxeed@gmail.com