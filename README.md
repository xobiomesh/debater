###############################################
# _____ _             ____                _   #
#|_   _| |__   ___   / ___|_ __ ___  __ _| |_ #
#  | | | '_ \ / _ \ | |  _| '__/ _ \/ _` | __|#
#  | | | | | |  __/ | |_| | | |  __/ (_| | |_ #
# _|_| |_| |_|\___|  \____|_|  \___|\__,_|\__|#
#|  _ \  ___| |__   __ _| |_ ___ _ __         #
#| | | |/ _ \ '_ \ / _` | __/ _ \ '__|        #
#| |_| |  __/ |_) | (_| | ||  __/ |           #
#|____/ \___|_.__/ \__,_|\__\___|_|           #
###############################################

This app run using llama 8B model with inference from the Groq api
Visit groq.com for more info

To run locally:
1. Install Node.js

install dependencies:
npm install express body-parser grok-sdk dotenv express-basic-auth


Then run:
node server.js

open http://localhost:3000 in browser

To serve online install and use ngrok
and run:
ngrok http 3000

open https link provided in the console in your favourite browser

Default login is admin:thegreat & password:debater
To change from default password serch 'Configure basic authentication'
in server.js file and modify accordingly

