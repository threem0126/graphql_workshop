import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { forwardTo } from "prisma-binding";
import {isMutation, isQuery, isQuery_forwardTo} from '../lib/resolvers.loader'
import _GKBase from './../models_private/_GKBase'

class _ {
    /**
     * 业务静态类，不提供对象实例化
     */
    constructor() {
        throw '静态业务功能类无法实例化'
    }

    @isQuery
    static async gettestUser(parent, {name, email, password}, ctx, info) {
        return {
            name:"asdf"
        }
    }

    @isMutation
    static async signup(parent, {name, email, password}, ctx, info) {
        const hashed_password = await bcrypt.hash(password, 10)
        const user = await ctx.db.mutation.createUser({
            data: { name, email, password:hashed_password },
        })

        return {
            token: jwt.sign({ userId: user.id }, process.env.APP_SECRET),
            user,
        }
    }

    @isMutation
    static async login(parent, { email, password }, ctx, info) {
        const user = await ctx.db.query.user({ where: { email } })
        if (!user) {
            throw new Error(`No such user found for email: ${email}`)
        }

        const valid = await bcrypt.compare(password, user.password)
        if (!valid) {
            throw new Error('Invalid password')
        }

        return {
            token: jwt.sign({ userId: user.id }, process.env.APP_SECRET),
            user,
        }
    }

    @isQuery
    static async currentuser(parent, args, ctx, info) {
        let { _hello } = ctx
        console.log(_hello);
        const {userId} = ctx
        if(!userId)
            throw new AuthError()
        return ctx.db.query.user({where:{id:userId}}, `{id, name}`)
    }

    @isQuery_forwardTo
    static user(){
        return forwardTo
    }

    @isQuery_forwardTo
    static users(){
        return forwardTo
    }
}

export default _