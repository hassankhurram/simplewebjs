"use strict";

import { BaseController } from '../controllers/baseController.js';
import { AuthController } from '../controllers/authController.js';
import { authenticatedAPI } from '../middleware/authenticationMiddleware.js';
export default class BaseRouter {

    static urlPath = "/";

    constructor(router, controller)
    {
        this.router = router;
        this.controller = controller ? controller : BaseController;
        this.router.get("/", authenticatedAPI, BaseController.home)
    }

}