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
# TCHAT :
- add between = [] (mais ou ? dans model message ? )
- populer mangoose


- refacto les notifications + gerer toutes les erreurs
- check si un username / email est deja utilisé
- supprimer le fichier de l'avatar si update


- deplacer getChannels() à l'ouverture de la chatbox
- keep data in state redux

- user : [ {
    id: '123488',                   // <= userMe
    socketID: 'AA789456', 
    username: 'PierreMrt',
    channelsList: [{
        channelId: '11222888999,    // <=
        userFrontId: '11222'        // <= userFront
    }],
}, ... ]

- message: [ {
    id: '523476', 
    channelId: '11222888999', 
    authorId: '123488',             // <= user??     if (authorId === user.id) ? userMe : userFront
    content: 'Salut kjkj koo jkjkjk',              
    created_at: Date()
}, ... ]
