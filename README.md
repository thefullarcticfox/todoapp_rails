# Todo App on Rails 6 with backbone.js

Simple Todo webapp on Rails 6 using PostgreSQL as database and backbone.js as frontend

### Includes
* An implementation by Jérôme Gravel-Niquet's rewritten by TodoMVC and ported to Rails 6
([source](https://backbonejs.org/examples/todos/index.html))
* A simple single page app implementation on backbone.js MVC
* A simple multi-page scaffold implementation on Rails MVC

### Requirements
* PostgreSQL 12.0+
* Ruby 3.0.0
* Rails 6.1.0+
* Node.js with npm and yarn

### Modules installed with yarn
* jquery 3.6.0
* underscore.js 1.12.1
* backbone.js 1.4.0

### Setup and Run
1. Install PostgreSQL 12+
2. Install Ruby and Rails 6 gem
3. `bundle install`
4. `yarn install`
5. `./bin/rake db:setup`
6. `./bin/rake db:migrate`
7. `./bin/rails s`

### Test in browser
Open `127.0.0.1:3000` in any modern browser
