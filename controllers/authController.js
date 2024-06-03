"use strict";
import { BaseController } from "./baseController.js";
import Debugger from "../utils/debugger.js";
import Joi from "joi";
import jwt from "jsonwebtoken"
import fs from "fs";
import bcrypt from "bcrypt";
const usersFile = JSON.parse(fs.readFileSync("configurations/users.json", { encoding: "utf-8" }));
const rolesPermissionFile = JSON.parse(fs.readFileSync("configurations/roles_permissions.json", { encoding: "utf-8" }))
const successRedirectUrl = "/"
export class AuthController extends BaseController {

    constructor() {
        super();
    }

    static async generateLoginPage(req, res) {
        try {
            // const encryptedPassword = await bcrypt.hash("admincompliance", parseInt(process.env.PASS_SALT_ROUNDS) || 10);
            // console.log("admincompliance", encryptedPassword)
            if(req.headers.hasOwnProperty("cookie"))
            {
                if (req.cookies.hasOwnProperty("token")) {
                    try {
                        let verifyToken = jwt.verify(req.cookies.token, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
                        if (verifyToken) {
                            return res.redirect(successRedirectUrl+"?message=You are already logged in");
                        }
                    }
                    catch(error)
                    {
                        console.log("error.message",error.message)
                    }
                    
                }   
            }
            return res.generateView({ page: "login", layout: "authcontext" });
        }
        catch (error) {
            return Debugger.throw(res, "authController.js", "login", error)
        }
    }
    static async logOutUser(req, res) {
        try {
            return res.clearCookie("token").redirect("/login");
        } catch (error) {
            return Debugger.throw(res, "authController.js", "login", error)
        }
    }
    static async attemptLogin(req, res) {
        try {


            const schema = Joi.object({
                email: Joi.string().email().min(3).max(30).required(),
                password: Joi.string().min(3),
            });
            try {

                await schema.validateAsync(req.body);
                let isValidCredentials = false;
                const { email, password } = req.body;
                usersFile.find(user => {
                    if (user.email === email && bcrypt.compareSync(password, user.password)) {
                        const permissions = user.roles.map(e=>rolesPermissionFile[e]).flat();
                        const userData = {
                            email: email,
                            user_id: user.id,
                            roles: user.roles,
                            permissions: permissions.filter((item, index) => permissions.indexOf(item) === index),
                            profile_image: user.profile_image,
                            designation: user.designation,
                            user_name: user.user_name
                        };
                        
                        const token = jwt.sign(
                            {...userData},
                            process.env.JWT_SECRET,
                            { expiresIn: process.env.JWT_EXPIRES_IN }
                        );

                        isValidCredentials = true;
                        
                        return res.cookie("token", token, {
                            httpOnly: true,
                            maxAge: 1000 * 60 * 60 * 24 * 7,
                            secure: process.env.NODE_ENV === "production" ? true : false,
                            sameSite: "strict"
                        }).redirect(successRedirectUrl);
                        
                    }
                })
                if(!isValidCredentials)
                {
                    return res.generateView({
                        page: "login", layout: "authcontext", data: {
                            errors: "Invalid Credentials"
                        }
                    })
                }   
            }
            catch (error) {
                console.log(error)
                const newErrors = error?.details?.map(x => x.message).join(",");
                return res.generateView({
                    page: "login", layout: "authcontext", data: {
                        errors: newErrors
                    }
                })
            }

        }
        catch (error) {
            return Debugger.throw(res, "authController.js", "login", error)
        }
    }

}