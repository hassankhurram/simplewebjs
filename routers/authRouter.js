import BaseRouter from './baseRouter.js';
import { AuthController } from '../controllers/authController.js';


export default class AuthRouter extends BaseRouter{

    static urlPath = "/auth";

    constructor(router) {
        super(router, AuthController);
        this.router.get('/login', AuthController.generateLoginPage);
        this.router.get('/logout', AuthController.logOutUser);
        this.router.post("/submit_login", AuthController.attemptLogin);
    }

};

