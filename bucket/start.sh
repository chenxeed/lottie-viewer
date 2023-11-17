if [ ${ENV} = "DEV" ]; then 
    npm start
else
    npm run build && npm run serve
fi