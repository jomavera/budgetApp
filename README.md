# BudgetApp

## Description
This website allows to a certain user to create and store *Items*. With these *Items* the user also can create and store *Budgets*.

> This is a capstone project for [CS50's Web Programming with Python and Javascript](https://cs50.harvard.edu/web/2020/)

## Specifications

### Tools

This website was made with **Django** for the backend and with **Javascript** for the frontend. I used Javascript to manipulate the DOM and html templates. Django is used for database, routing and API requests. In order to make the website mobile-responsive I used **Bootstrap**. I wrapped all the html elements inside the appropiate responsive classes.

### Database

It uses Django models and have 5 models:

- **User**: It stores the info of the users. Each user can create Items and Budgets.

- **Items**: Items are part of a budget and have many characteristics as units, unit's cost, name, type, etc.

- **Units**: Each Units' element consists of a name and user who created.

- **Tipo**: It stores information about the different types of items.

- **Product**: It stores the information of instances of Items that belongs to a Budget.

- **Budget**: It stores the information of Budgets. A Budget consists of Products (which are instances of Items).


## Files

This project follows the structure of past course projects.The website code is inside `budgetApp` directory. 
Inside this directory are the folowing files and directories:

- `static` directory: Here are the Javascript files that manipulates the DOM and html templates.

- `templates` directory: Here are the html templates of the webpages. 

- `models.py` file: This file specifies the django models for the database

- `urls.py` file: This file specifies the rendering of urls and API routes

- `views.py` file: Here is the code to render the html templates or deal with Http requests.

## Instructions

> WARNINING: This respository is not production ready. Django Secret Key is exposed

1. Run `python manage.py runserver` to start web application in localhost

2. Got to `localhost:8000` on browser

3. Register or Log in with the following credientials `user`:jose@example.com `password`: 1234

Here is [video](https://youtu.be/bviXT05DLRI) showing the functionality
