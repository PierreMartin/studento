#!/usr/bin/env bash

if [ -e server/data/categories.json ]; then
        echo "file exist :)"

        # mongo
        # mongo --eval 'use hubnote;'
        # mongo --eval 'db.categories.remove({});'

        jq -c '.categories[]' server/data/categories.json | while read i; do
            echo $i

            # mongo --eval 'db.categories.insert('$i');'
            # mongo --eval 'db.categories.find();'
        done

        echo "JSONs displayed"
else
        echo "File don't exist :("
fi
