Here are a few notes I made from the traversy vid at https://www.youtube.com/watch?v=SBvmnHTQIPY  
  
    
    

to start:
```
npm init
```
```
npm i express mongoose connect-mongo express-session express-handlebars dotenv method-override moment morgan passport passport-google-oauth20
```

These are the packages and their purpose:

connect-mongo - store sessions in db for reset server don't logout
express-session - sessions & cookies
express-handlebars - template engine
method-override - for put & delete requests from templates
moment - format dates
morgan - logging
passport - authentication
passport-google-oauth20 - for googles oauth 2.0

<br/>
<br/>
<br/>

There are some differences between what was in the video and what I found I had to change in order to get it to work.
Some modules have been updated since, so here's what I changed:
<br/>
<br/>
<br/>

**in config/db.js:**

Where it says:
```
const connectDB = async () => {
	try {
	const conn = await mongoose.connect(process.env.MONGO_URI, {
**--->** 'useFindAndModify: false'
	})
	}
}
```
REMOVE 'useFindAndModify: false' and be sure to check your commas  
<br/>
<br/>
<br/>
  
**in routes/auth.js:**
```
router.get('/logout', (request, response) => {
	request.logout()
	response.redirect('/')
}
```
**REPLACE completely with:**
```
router.get('/logout', (request, response) => {
	request.logout(err => {
		if(err) {
			return next(err)
		}
		response.redirect('/')
	})
}
```
<br/>
<br/>
<br/>
 
**in app.js:**
```
const MongoStore = require('connect-mongo')(session)
```
remove '(session)'
<br/>
<br/>
<br/>
ALSO in app.js

```
app.use(
	session({
		secret: 'keyboard cat',
		resave: false,
		saveUninitialized: false,
**-->>**store: new MongoStore({ mongooseConnection: mongoose.connection })
```
CHANGE:
```
store: new MongoStore({ mongooseConnection: mongoose.connection})
```
TO
```
store: MongoStore.create({ mongoUrl: process.env.MONGO_URI})  
```
<br/>
<br/>
<br/>
   
**in app.js**
```
// Handlebars
app.engine(
  '.hbs',
  exphbs({
  helpers: {
    formatDate,
    stripTags,
    truncate,
    editIcon,
    select,
  },
  defaultLayout: 'main',
  extname: '.hbs'}))
app.set('view engine', '.hbs')
```
it's:
```
app.engine('.hbs', exphbs**.engine**({etc etc}))
```
instead of how its written in the original vid
```
app.engine('.hbs', exphbs({etc etc}))
```

If you caught anything else I didn't, feel free to let me know!

