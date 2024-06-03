"use strict";

import {generateView} from "../utils/generator.js";
import Debugger from "../utils/debugger.js";

export class BaseController {

    static generateView = generateView;
    static Debugger = Debugger;

    constructor()
    {
        this.generateView = generateView;
        this.Debugger = Debugger;
    }

    static async home(req, res)
    {
        
        return generateView({ title: "Home", page: "index", layout: "dashboardcontext"},res)
    }

}