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

- /course/create/new
- /course/edit/${course._id}
- /course/${course._id}

### Categories (create the Menu) - See categories.json :
db.categories.remove({})
db.categories.insert({"name":"Technology","description":"Technology blah blah","key":"technology","picto":"code","subCategories":[{"name":"Web development","description":"Web development blah blah","key":"web","picto":"code"},{"name":"Administrators","description":"Administrators blah blah","key":"administrators","picto":"code"},{"name":"Linux","description":"Linux blah blah","key":"linux","picto":"code"},{"name":"Game development","description":"Game development blah blah","key":"game","picto":"code"},{"name":"Software Engineering","description":"Software Engineering blah blah","key":"software-engineering","picto":"code"},{"name":"RaspBerry Pi","description":"RaspBerry Pi blah blah","key":"pi","picto":"code"},{"name":"Aduino","description":"Aduino blah blah","key":"aduino","picto":"code"},{"name":"Bitcoin and Cryptocurrencies","description":"Bitcoin and Cryptocurrencies blah blah","key":"cryptocurrencies","picto":"code"}]})
db.categories.insert({"name":"Life / Arts","description":"Life / Arts blah blah","key":"life","picto":"universal access","subCategories":[{"name":"Photography","description":"Photography blah blah","key":"photography","picto":"code"},{"name":"Graphic Design","description":"Graphic Design blah blah","key":"graphic","picto":"code"},{"name":"Music","description":"Music blah blah","key":"music","picto":"code"},{"name":"Movies & TV","description":"Movies & TV blah blah","key":"movies","picto":"code"}]})
db.categories.insert({"name":"Culture / Recreation","description":"Culture / Recreation blah blah","key":"culture","picto":"travel","subCategories":[{"name":"Travel","description":"Travel blah blah","key":"travel","picto":"code"},{"name":"English Learning","description":"English Learning blah blah","key":"english","picto":"code"}]})
db.categories.insert({"name":"Science","description":"Science / Recreation blah blah","key":"science","picto":"lab","subCategories":[{"name":"Mathematics","description":"Mathematics blah blah","key":"mathematics","picto":"code"},{"name":"Physics","description":"Physics blah blah","key":"physics","picto":"code"},{"name":"Chemistry","description":"Chemistry blah blah","key":"chemistry","picto":"code"},{"name":"Biology","description":"Biology blah blah","key":"biology","picto":"code"}]})
db.categories.insert({"name":"Other","description":"Other blah blah","key":"other","picto":"database","subCategories":[{"name":"Data","description":"Data Data Data","key":"data","picto":"database"}]})        
db.categories.find()

OU AVEC JQ :
$ brew install jq
$ sudo chmod +x scripts/generate_menu.sh
$ ./scripts/generate_menu.sh

### TODO :
db.companies.count() to get the number of documents in the collection   https://stackoverflow.com/questions/9703319/mongodb-ranged-pagination
- gerer les paginations (sur Home et Dashboard) + Ajouter un bouton (comme zalando) pour trier sur TOUTES les datas -> faire requete pour ca
- Create = quand on change de catégory, vider les sous cat !!
- gerer la gestion de la génératon du contenu des cours en .md


- Faire Menu listant les cats/subCats + Page Courses
- staredBy
- commentedBy
- Mettre un Breadcrumb


- this.state.typingArr => le mettre dans le store de redux (gerer les cas ou l'un ecrit, l'autre a pas encore ouvert la popup)
- ajouter lastMessageContent


- refacto les notifications + gerer toutes les erreurs
- check si un username / email est deja utilisé
- supprimer le fichier de l'avatar si update
