#!/bin/bash
set -e  

dockerize -timeout 60s \
    -wait tcp://mongodb1:27017 \
    -wait tcp://mongodb2:27017 \
    -wait tcp://mongodb3:27017

STATUS=$(mongosh --host mongodb1 --port 27017 --username admin --password 1234 --authenticationDatabase admin --eval "rs.status()" --quiet | grep 'myRepl' || true)

if [ -z "$STATUS" ]; then
    echo "Replica set not initialized. Initializing now..."
    mongosh --host mongodb1 --port 27017 --username admin --password 1234 --authenticationDatabase admin --eval "rs.initiate({
        _id: \"myRepl\",
        members: [
            {_id: 0, host: \"mongodb1:27017\"},
            {_id: 1, host: \"mongodb2:27017\"},
            {_id: 2, host: \"mongodb3:27017\"}
        ]
    })"

    echo "Creating admin user..."
    mongosh --host mongodb1 --quiet --eval '
        use admin;
        db.createUser({
            user: "admin",
            pwd: "1234",
            roles: [ { role: "root", db: "admin" } ]
        });
    '
else
    echo "Replica set already initialized. Skipping initialization and user creation."
fi

echo "Replica set status (with auth):"
mongosh --host mongodb1 --port 27017 --username admin --password 1234 --authenticationDatabase admin --eval "rs.status()"
