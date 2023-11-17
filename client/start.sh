if [ ${ENV} = "DEV" ]; then 
    npm start
else
    npm run build && serve -l 3000 -s build
fi