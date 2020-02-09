#Config server 
export APP_HOST=localhost
export APP_PORT=3000
export SESSION_KEY=express.sid
export SESSION_SECRET=mySecret
#Config Mongodb
export DB_CONNECTION=mongodb
export DB_HOST=localhost
export DB_PORT=27017
export DB_NAME=messenger
export DB_USER=""
export DB_PASSWORD=""

#Config admin email account
export EMAIL_USER=mthang1801@gmail.com
export EMAIL_PASSWORD=t6cantho
export EMAIL_HOST=smtp.gmail.com
export EMAIL_PORT=587

#Config login facebook app
export FB_APP_ID=651225298693070
export FB_APP_SECRET=7dc27732f168e2540a719051816f0662
export FB_CALLBACK_URL=https://localhost:3000/auth/facebook/callback

#Config login google app
export GG_APP_ID=1000351305050-n8gi2ihot8iatdret5sd39k6rp4d8iku.apps.googleusercontent.com
export GG_APP_SECRET=1O53iEq-JBZEZHylZADbwxWV
export GG_CALLBACK_URL=https://localhost:3000/auth/google/callback
