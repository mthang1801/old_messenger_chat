import express from "express" ;
import expressEjsExtend from "express-ejs-extend" ;

let configViewEngine = (app) => {
  app.use(express.static("./src/public")) ;
  app.engine("ejs" , expressEjsExtend) ;
  app.set("views" , "./src/views");
  app.set("view engine" , "ejs");
}

module.exports = configViewEngine;
