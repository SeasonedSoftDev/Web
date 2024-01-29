import express, { Express, Response, Request } from "express"

import executeQuery from "../config/dbpost"

export const Router = express.Router()

Router.post("/add", async (req: Request, res: Response) => {
    if (req.body.name && req.body.sex && req.body.birthday) {
        try {
            await executeQuery(`INSERT INTO "test" (name,sex,birthday) VALUES ('${req.body.name}','${req.body.sex}','${req.body.birthday}')`)
            res.status(200).send()
        } catch(err){
            console.log(err)
            res.status(500).send()
        }
    } else
        res.status(400)
})

Router.post("/del", async (req: Request, res: Response) => {
    if (req.body.ID) {
        try {
            await executeQuery(`DELETE FROM "test" WHERE id = ${req.body.ID}`)
            res.status(200).send()
        } catch(err){
            console.log(err)
            res.status(500).send()
        }
    }
})

Router.post("/update", async (req: Request, res: Response) => {
    if (req.body.name && req.body.sex && req.body.birthday, req.body.ID) {
        try {
            await executeQuery(`UPDATE "test" set "name" = '${req.body.name}', "sex" = '${req.body.sex}', "birthday" = '${req.body.birthday}' WHERE "id" = '${req.body.ID}'`)
            res.status(200).send()
        } catch(err){
            console.log(err)
            res.status(500).send()
        }
    }
})

Router.post("/get", async (req: Request, res: Response) => {
    try {
        let result : any = await executeQuery(`SELECT "id" AS "ID", "name", "sex", "birthday" FROM "test"`)
        res.status(200).send(result.rows)
    } catch(err){
        console.log(err)
        res.status(500).send()
    }
})
