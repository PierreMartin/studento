sudo chown -R $USER:$GROUP ~/.npm
sudo chown -R $USER:$GROUP ~/.config
sudo chown -R $USER:$GROUP $PWD   (if no right when rimraf)

### development :
$ sudo mongod
$ npm run dev

### Mongo :
- db: 'hubnote'

$ mongo 
$> show dbs
$> use hubnote
$> show collections

db.courses.find()
db.courses.find({ category: 'technology' }, { _id:0, title: 1 } )                       // ALL for me
db.courses.find({ category: 'technology', isPrivate: false }, { _id:0, title: 1 } )     // ALL for public

Pagination :
db.courses.find({ category: 'technology' }, { _id:0, title: 1 } ).sort({ 'stars.average': 1 }).skip(page * limit).limit(limit).pretty()

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
db.categories.insertMany([
    {"name":"Technology","description":"Technology blah blah","key":"technology","picto":"code","subCategories":[{"name":"Web development","description":"Web development blah blah","key":"web","picto":"code"},{"name":"Administrators","description":"Administrators blah blah","key":"administrators","picto":"code"},{"name":"Linux","description":"Linux blah blah","key":"linux","picto":"code"},{"name":"Game development","description":"Game development blah blah","key":"game","picto":"code"},{"name":"Software Engineering","description":"Software Engineering blah blah","key":"software-engineering","picto":"code"},{"name":"RaspBerry Pi","description":"RaspBerry Pi blah blah","key":"pi","picto":"code"},{"name":"Aduino","description":"Aduino blah blah","key":"aduino","picto":"code"},{"name":"Bitcoin and Cryptocurrencies","description":"Bitcoin and Cryptocurrencies blah blah","key":"cryptocurrencies","picto":"code"}]},
    {"name":"Life / Arts","description":"Life / Arts blah blah","key":"life","picto":"universal access","subCategories":[{"name":"Photography","description":"Photography blah blah","key":"photography","picto":"code"},{"name":"Graphic Design","description":"Graphic Design blah blah","key":"graphic","picto":"code"},{"name":"Music","description":"Music blah blah","key":"music","picto":"code"},{"name":"Movies & TV","description":"Movies & TV blah blah","key":"movies","picto":"code"}]},
    {"name":"Culture / Recreation","description":"Culture / Recreation blah blah","key":"culture","picto":"travel","subCategories":[{"name":"Travel","description":"Travel blah blah","key":"travel","picto":"code"},{"name":"English Learning","description":"English Learning blah blah","key":"english","picto":"code"}]},
    {"name":"Science","description":"Science / Recreation blah blah","key":"science","picto":"lab","subCategories":[{"name":"Mathematics","description":"Mathematics blah blah","key":"mathematics","picto":"code"},{"name":"Physics","description":"Physics blah blah","key":"physics","picto":"code"},{"name":"Chemistry","description":"Chemistry blah blah","key":"chemistry","picto":"code"},{"name":"Biology","description":"Biology blah blah","key":"biology","picto":"code"}]},
    {"name":"Other","description":"Other blah blah","key":"other","picto":"database","subCategories":[{"name":"Data","description":"Data Data Data","key":"data","picto":"database"}]}
])

OU AVEC JQ :
$ brew install jq
$ sudo chmod +x scripts/generate_menu.sh
$ ./scripts/generate_menu.sh

paginationMethod => 'push' | 'skip'

### TODO :
- Auth facebook google...
- config/env.js
- width 100% du panelExplorer en mode mobile + déplier le panelExplorer quand mode create
- refonte Home
- pouvoir supprimer les avatars

- Prévoir la possibilité de faire des groupes de notes
    (user.notesGroups: [{id: '1', title: 'Chimie 2018'}])
    (note.groupId: '1')
        
        CODE:
        const groups = {};
        for (let i = 0; i < notes.length; i++) {
        	if (typeof notes[i].groupId !== 'undefined') {
                const group = notesGroups.filter((group) => group.id === notes[i].groupId);
                if (group) {
                    groups[group.id].title = group.title;
                    groups[group.id].note.push(notes[i]);
                    notes.splice(i, 1); // delete
                }
            }
        }

                        Object.values(groups).map(grp)
            groupe1         grp.title
                note1       grp.note.map()
                note2
                note3
            groupe2
                note1
                note2
                note3
            note1       notes.map()
            note2
            note3

- Prévoir la possibilité de faire des groupes de personne
    (user.usersGroupsIds: ['1', '42'])
    (collection => usersGroups: [{id: '42', title: 'ucpa', usersAdmin: ['65656pierre1231'], users: ['65656pierre1231', 'dsjsldkdslksd']}])
    
    RENDRE PUBLIC DES NOTES A UNE GROUPE => Quand on selectionne une note et qu'on lui dis d'etre visible pour le groupId '42':
    (note.isPrivate: true, note.isNotPrivateFor: [usersGroups.users])


- dotenv voir pourquoi deplacé dans devDependance
- pouvoir uploader images dans les cours
- Commentaires sur une zone de texte

- HomePage + RWD
- Resolve vulnerabilities in dependencies
- Google analytique
- RGPD cookie banner - voir express-session - fait ca en localStorage   componentDidMount de la Home -> setConsentRGPDAction(getLocalStorage('key'))  - dans LayoutMainWeb on récup isConsentRGPD du store
- referencement

moins urgent :
- revoir css !! -> mettre les css en top level component uniquement

- sync au scroll - "voir codemirror sync scroll" ou "limiter la vitesse du scroll a un maximum" sur Google mais probleme a cause du DOM qui se rend au fure et a mesure du scroll...
    - TOUT LE TEMPS DESACTIVE  - avoir le button ACTIVER LE SYNC UNIQUEMENT au click sur le button, juste un instant (evite plein de bugs)
    - Faire le sync scroll quand on ECRIT
    - BUG : il considere "----------" comme un titre

- pouvoir mettre schémas dans les cours
- courseToolbar : Add to fav - download to PDF
- comments -> render: styles (gras, bold, emoji, ...) + code editor
- comments -> send notification with socket.io to author of course (Fetch all my courses + where commentedBy.length > 0)
- starings -> send notification with socket.io to author of course
- duplicate style (lists, checksList...) when enter on new line
- faire menu catégories aside comme grafikart, en destock uniquement

- transactions => replica set with just one member (or run-rs) + Mongoose 5.2.0
- améliorer la requet d'upate de l'user comme pour les courses

- this.state.typingArr => le mettre dans le store de redux (gerer les cas ou l'un ecrit, l'autre a pas encore ouvert la popup)
- ajouter lastMessageContent


- refacto les notifications + gerer toutes les erreurs
- check si un username / email est deja utilisé
- supprimer le fichier de l'avatar si update


# AUTH - LOGIN :
=> controller login() { CALL passport.authenticate('local') }
=> passport/local.js 
=> model CALL comparePassword()
=> controller login() { passport.authenticate() { HERE } }
=> controller login() { passport.authenticate() { CALL req.logIn } } si dedant, on est authentifié


# TODO faire toutes les requetes comme ca:
const query = [{ keyReq, valueReq }] || { keyReq, valueReq } || {};
const querySearch = [{ keyReq, fieldSearchTyping }] || {};
const queryPagination = activePage || 1;
const queryOption = { sortBy: name, filter: toto } || {};

this.props.fetchSomethingAction(query, queryPagination, queryOption);
this.props.searchSomethingAction(querySearch, queryPagination, queryOption);

Facilité l'acces à l'imformation
Le site internet propose les services suivants :
- La publication de cours pouvant contenir : des notes (texte), des astuces, des idées, du code source, des formules mathématiques, des schémas...
- La possibilité de donner des notes aux courses.
- La possibilité d'ajouter des commentaires associé à un cours.
- La possibilité de pouvoir communiquer avec d'autre utilisateur par un chat en temps réel.
- La possibilité de completer les informations de sont profil : nom, prénom, age, intérêts, profession...
