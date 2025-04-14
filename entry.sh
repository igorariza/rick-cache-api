#!/bin/bash
set -e


DATABASE_URL=mysql://root:admin@127.0.0.1:3306/admin
DB_NAME=admin
DB_USER=root
DB_PASSWORD=admin
DB_HOST=localhost
DB_PORT=3306
DB_DRIVER=mysql
DB_DIALECT=mysql
REDIS_URL=redis://localhost:6379
PORT=4000
CACHE_EXPIRATION=3600


TOTAL_PAGES=$(curl -s https://rickandmortyapi.com/api/character | jq -r .info.pages)
i=0
k=0
while [ "$i" -le ${TOTAL_PAGES} ]; do
        i=$((i+1));
                
        curl --request GET -s "https://rickandmortyapi.com/api/character?page=${i}" | jq -r '.results' > res.json
        jq -c '.[]' res.json | while read j; do                   
                name=$(echo ${j}  | jq -r '.name')
                status=$(echo ${j}  | jq -r '.status')
                species=$(echo ${j}  | jq -r '.species')
                gender=$(echo ${j}  | jq -r '.gender')
                image=$(echo ${j}  | jq -r '.origin')
                # created=$(echo ${j}  | jq -r '.created')
                
                echo "INSERT INTO characters (name,status,species,gender,origin) VALUES ('${name//\'/\'}','${status//\'/\'}','${species}','${gender//\'/\'}','${origin//\'/\'}')"  | mysql --user=$DB_USER --password=$DB_PASSWORD --host=$DB_HOST $DB_NAME 
                
        done    
done

exec "$@"