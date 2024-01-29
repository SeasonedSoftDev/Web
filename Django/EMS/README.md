# Elevator System  #

!(https://github.com/SolomonNewCentury/Elevator)

A elevator system which goes up, down and stops built with Django(Django Rest Framework including Viewsets, Serializers and etc.)

## Architecture ##
 - When a user logs in, the frontend downloads the elevator list set already. In first case, there will be no elevator set in elevator list
 - So, users can set the number of elevators by clicking format button bellow login button. Then this elevator system is initialized.
   While using this system, users can initialize system like this.
 - After that, elevators are displayed in interface.
 - Each elevator is divided into two status: opened or closed
 - Each elevator contains follow things:
   . floor that elevator is located
   . floor to go up or down based on request of user
   . status to mark whether elevator is in maintenance or not
   . status to mark whether elevator is operational or not
   . status to mark whether elevator has to go up or down
   . status to mark whether elevator is running or not
 - Users can change all of these things by clicking Edit button
 - Users can use only elevator that is operational and not in maintenance, not in running and set clear destination


### Requests ###


**update 04/06/19**

- using pipenv for package management
- move to Channels 2
- use redis as the channel layer backing store. for more information, please check [channels_redis](https://github.com/django/channels_redis)

### Database ###
For this system, I have used postgreSQL.
In using of this, you has to consider about version of postgreSQL and django. I used django 5.0 and postgreSQL 16.1

## Assumptions ##

Because of time constraints this project lacks of:

- User Sign-Up / Forgot Password
- Good Test Coverage
- Better Comments / Documentation Strings
- Frontend & Backend Tests
- Modern Frontend Framework (like React)
- Proper UX / UI design (looks plain bootstrap)

## Run ##

0. Download and Install latest version of python

1. Create and activate a virtualenv (Python 3)
```bash
pipenv --python 3 shell
```
2. Install requirements
```bash
pipenv install
```
3. Create a MySQL database
```sql
CREATE DATABASE chat CHARACTER SET utf8;
```
4. Start Redis Server
```bash
redis-server
```

5. Init database
```bash
./manage.py migrate
```
6. Run tests
```bash
./manage.py test
```

7. Create admin user
```bash
./manage.py createsuperuser
```

8. Run development server
```bash
./manage.py runserver
