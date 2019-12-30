# YelpCamp-Project
YelpCamp is a full stack web application followed REST
architecture and came with features including authentication,  and CRUB operations. The application is hosted on heroku(https://yelpcamp-of-siningtong.herokuapp.com/) with connenction to a cloud MongoDB Atlas database. Users can create,delete,read, and edit campgrounds or comments after registered and logged in. They are only authorized to edit and delete their own campgronds and comments.
## Final Product
### Registration and login page
!["Registration and login page"](https://github.com/siningtong/YelpCamp-Project/blob/master/docs/YelpCam-login.gif?raw=true)
### Add new campgrounds and comments
!["Add new campgrounds and comments"](https://github.com/siningtong/YelpCamp-Project/blob/master/docs/YelpCamp-create%20new%20campground.gif?raw=true)
### Can only delete owned campgrounds and comments
!["Can only delete owned campgrounds and comments"](https://github.com/siningtong/YelpCamp-Project/blob/master/docs/YelpCamp-delete.gif?raw=true)
### Fuzzy search
!["Fuzzy search"](https://github.com/siningtong/YelpCamp-Project/blob/master/docs/YelpCam-fuzzySearch.gif?raw=true)
## Technical Information / Stack
Todo List is a full stack web app, built with the following:

- HTML
- JavaScript
- MangoDB
- Css
- Google Map API
- Bootstrap
## Dependencies
- body-parser: "^1.19.0",
- connect-flash: "^0.1.1",
- dotenv: "^8.2.0",
- ejs: "^3.0.1",
- express: "^4.17.1",
- express-session: "^1.17.0",
- method-override: "^3.0.0",
- moment: "^2.24.0",
- mongodb: "^3.3.5",
- mongoose: "^5.7.14",
- node-geocoder: "^3.25.0",
- nodemon: "^2.0.1",
- passport: "^0.4.1",
- passport-local: "^1.0.0",
- passport-local-mongoose: "^5.0.1"
## Getting Started
- Fork this repository, then clone your fork of this repository.
- Install dependencies using the npm install command.
- Start the web server using the npm run local command. The app will be served at http://localhost:3000/.
- Go to http://localhost:3000/ in your browser.