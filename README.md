# Todo App on Rails 6 with backbone.js

Simple Todo List web app

### Includes
* An implementation by Jérôme Gravel-Niquet's and TodoMVC ported to Rails 6
([source](https://backbonejs.org/examples/todos/index.html))
* Simple single page app implementation on backbone.js MVC
* Simple multi-page scaffold implementation on Rails MVC

### Requirements
* Ruby 3.0.0
* Rails 6.1.0+
* PostgreSQL 12.0+
* Node.js with npm and yarn

### Modules installed with yarn
* jquery 3.6.0
* underscore.js 1.12.1
* backbone.js 1.4.0

### Setup and Run
1. Install Ruby and Rails gem
2. Install PostgreSQL 12+
3. `bundle install`
4. `yarn install`
5. `./bin/rake db:setup`
6. `./bin/rake db:migrate`
7. `./bin/rails s`

### Test in browser
Open `127.0.0.1:3000` in any modern browser
