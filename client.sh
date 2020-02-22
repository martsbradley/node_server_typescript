####curl --header "Content-Type: application/json" \
####  --request POST \
####  --data '{"text":"one"}' \
####   http://localhost:3000/messages/

####curl --header "Content-Type: application/json" \
####  --request POST \
####  --data '{"text":"two"}' \
####   http://localhost:3000/messages/

####curl --header "Content-Type: application/json" \
####  --request POST \
####  --data '{"text":"three"}' \
####   http://localhost:3000/messages/


####echo "";
####curl -X GET -H " -Type:application/json" http://localhost:3000/messages/1
####echo "";
####curl -X GET -H " -Type:application/json" http://localhost:3000/messages/2
####echo "";
####curl -X GET -H " -Type:application/json" http://localhost:3000/messages/3
####echo "";


curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"email":"m@artshome.com",
           "password": "1"}' \
   http://localhost:3000/login/
