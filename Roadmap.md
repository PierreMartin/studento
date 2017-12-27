### development :
$ sudo mongod
$ npm run dev

### Mongo :
- db: 'studento'

$ mongo 
$> show dbs
$> use studento
$> show collections

db.cours.find()
db.cours.find({"text": "test 1"} , {_id:0}) 

db.users.remove({})
db.users.update({}, {$unset: {avatarsSrc: 1}}, false, true)
db.users.insert({text: "test 1", count: 0})

db.users.update({email: "pierre@gmail.com"} , {$set : {profile: {name: "Pierre Martin", gender: "male", picture: "http://localhost:3000/xxx"}} })  

user => créer un compte sur l'app (a@a.com 1111)
db.users.find()


/!!\ mongodb rajoute un 's' dans les collections + met tout en minuscule (sauf si déja un 's' a la fin)


db.users.findOne( { _id: ObjectId("59b923d8fe2c95d70482145f") } )
db.users.findOne({'_id': ObjectId("59b923d8fe2c95d70482145f") }, { avatarsSrc: { $elemMatch: { avatarId: 'avatar1' } } } )


### TODO :
# Reducer :
- users.js
- userMe.js
- authentification.js

    - state.users.single
    - state.users.all
    
# Actions :
- users.js      // add friends
- userMe.js     // upload avatar 
- authentification.js

# Controller
- authentification.js
- users.js

# unique email + username for login/signupp

- deplacer getChannels() à l'ouverture de la chatbox
- keep data in state redux

- user : [ {id: '123488', socketID: 'AA789456', username: 'PierreMrt'}, {id: '874446', socketID: 'BB789456', username: 'PaulMrt'}, {id: '584566', socketID: 'CC789456', username: 'PierreMrt'} ]
- channel: [ {id: '123456', between: [userID, userID]}, {id: '789456', between: ['123488', '874446']} ]
- message: [ {id: '523476', channelID: '123456', authorID: '123488', message: 'Salut', time: ''}, {id: '523476', channelID: '123456', authorID: '874446', message: 'ca va?', time: ''}} ]
