# gogovgo-website

## Instruction to setup
- Pull this repository to your local computer
  - `git clone git@github.com:burakbostancioglu/gogovgo-website.git`  
- Now open terminal/console
- Install the Python 2.7, Virtual Env, PIP and MySQL (http://docs.python-guide.org/en/latest/)
- Open MySQL and create `gogovgo_v1` DB 
- Create a new Virtual Env and activate it
- Go to the root directory of this repo (`gogovgo-website`)
  - From the root folder (`gogovgo-website`) type `pip install -r requirements.txt`
  - Create migrations using `python manage.py makemigrations --settings=gogovgo.settings.local`
  - Apply migrations using `python manage.py migrate --settings=gogovgo.settings.local`
  - Run Django server `python manage.py runserver 8030 --settings=gogovgo.settings.local`
- Open another terminal/console
  - Go to the root directory of the repo (`gogovgo-website`)
  - `cd frontend`
  - Install NPM and Node if you don't have. (https://www.npmjs.com/get-npm)
  - Type `npm install`
  - And then `npm start`
  
Now you can open your browser and type `http://localhost:3000/` to visit GoGovGo.
