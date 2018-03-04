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
- this.state.typingArr => le mettre dans le store de redux (gerer les cas ou l'un ecrit, l'autre a pas encore ouvert la popup)

- UNREAD => dans le store :
unreadMessages = {
	'454548989': {
	    users: [{...}, {...}],
		numberMessagesUnread: 3
	},
	'454548990': {
	    users: [{...}, {...}],
		numberMessagesUnread: 6
	}
}

- A chaque fois qu'on click sur la tchatBox => faire requete PUT sur tout les messages du channel    WHERE 'author._id !== userMe._id' && 'readBy: { user: me, time: null}'   UPDATE 'readBy: { user: me, time: date.now()}'
- faire la popup pour lister les messages non lu par channelId (afficher les usernames) et ouvrir la tchatBox au click



- refacto les notifications + gerer toutes les erreurs
- check si un username / email est deja utilisé
- supprimer le fichier de l'avatar si update


- user : [ {
    id: '123488',                   // <= userMe
    socketID: 'AA789456', 
    username: 'PierreMrt'
}, ... ]

- message: [ {
    id: '523476', 
    channelId: '11222888999', 
    authorId: '123488',             // <= user??     if (authorId === user.id) ? userMe : userFront
    content: 'Salut kjkj koo jkjkjk',              
    created_at: Date()
}, ... ]
