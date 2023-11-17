if [ ${ENV} = "DEV" ]; then 
    npm start
else
    npm run typeorm migration:run
    npm run build
    npm run serve
fi