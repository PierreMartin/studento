### development :
$ sudo mongod
$ npm run dev

### Mongo :
- db: 'studento'

$ mongo 
$> show dbs
$> use studento
$> show collections

db.courses.find()
db.courses.find({"text": "test 1"} , {_id:0}) 

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
- /course/create/new
- /course/edit/${course._id}
- /course/view/${course._id}


- page 'dashboard'    -> coursesListDashBoard(Uid) (buttons: [view | edit | delete])  -> page 'course' | page 'courseEdit' | popup 'delete'
- page 'courses'      -> coursesList(all)                                             -> page 'course'
- page 'course'       -> courseSingle(one)
- page 'courseAdd'
- page 'courseEdit'

Course: {
    uId, (author)
    category, (one possible : informatique, education, sport)
    subCategory, (many possible : javascript, web, front-end, ...)
    title,
    content,
    created_at,
    isPrivate,
    
    staredBy: [{
        username: { type: String, default: '' },
        at: { type: Date, default: null }
    }]
    
    commentedBy: [{
        username: { type: String, default: '' },
        at: { type: Date, default: null }
    }]
}

- this.state.typingArr => le mettre dans le store de redux (gerer les cas ou l'un ecrit, l'autre a pas encore ouvert la popup)
- ajouter lastMessageContent


- refacto les notifications + gerer toutes les erreurs
- check si un username / email est deja utilisé
- supprimer le fichier de l'avatar si update
