import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import path, { dirname } from 'path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import setRoutes from "./routers/routes.js";
import { generateView } from './utils/generator.js';
import { stateManager } from './utils/stateManager.js';



stateManager.init({
  startTime: Date.now()
});



stateManager.setState("defaultPageData", {

  // set default data for all pages
  
});

const defaultPageData = stateManager.getState("defaultPageData");

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const expressRouter = express.Router();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

const commonData = (req, res, next) => {
  res.locals = { ...res.locals, ...defaultPageData }
  res.generateView = generateView;
  next();
};

app.use(commonData);
//app.use(logger('dev'));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


await setRoutes(app, expressRouter);

// error handler
app.use(function (req, res, next) {
  generateView({ page: "http/error", layout: "basic", title: "404 not found", data: { message: `Url: "${req.url}" 404 not found` } }, res);
});

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  if (err) {
    generateView({ page: "http/error", layout: "basic", title: "500 internal server error", data: { message: err.message } }, res);
    console.log(err);
  }
  // render the error page
  next();
  //res.status(err.status || 500).render('error');

});


const _PORT = process.env.PORT || 7896
app.listen(_PORT, async () => {
  // await DBConfig.initialize()
  console.log("server started at port: " + _PORT)
})



export default app