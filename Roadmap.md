Need install NodeJs >=8.12.0
Need install npm >=6.4.1

sudo chown -R $USER:$GROUP ~/.npm
sudo chown -R $USER:$GROUP ~/.config
sudo chown -R $USER:$GROUP $PWD   (if no right when rimraf)

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

## Heroku

```bash
heroku login

cd <myapp>
heroku create

heroku config:set NPM_CONFIG_PRODUCTION=false
heroku run bash
npm i
npm start
# stop

# Deploy to Heroku server
git push heroku master

# Reload
heroku ps:scale web=0   heroku ps:scale web=1

# Database on Heroku (free)
heroku addons:create mongolab

# OPTIONAL:

# Rename if you need to
heroku apps:rename <newname>

# Open Link in browser
heroku open

# Open bash
heroku run bash

# Logs
heroku logs --tail

# var env
heroku config:set TOTO=salut
heroku config

# mongolab - To connect using the mongo shell:
mongo ds257732.mlab.com:57732/heroku_463h9sc1 -u <dbuser> -p <dbpassword>
```

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
- comments -> handle field require + use dompurify
- comments -> render: styles (gras, bold...) + code editor
- comments -> send notification with socket.io to author of course
- duplicate style (lists, checksList...) when enter on new line

- Faire Menu listant les cats/subCats + Page Courses
- staredBy
- Mettre un Breadcrumb
- Ajouter un bouton (comme zalando) pour trier sur TOUTES les datas -> faire requete pour ca

- Resolve vulnerabilities in dependencies
- Voir pk on a le props precedent à chaque changement de page
- Améliorer perfs codeMIrror
- améliorer la requet d'upate de l'user comme pour les courses

- this.state.typingArr => le mettre dans le store de redux (gerer les cas ou l'un ecrit, l'autre a pas encore ouvert la popup)
- ajouter lastMessageContent


- refacto les notifications + gerer toutes les erreurs
- check si un username / email est deja utilisé
- supprimer le fichier de l'avatar si update
