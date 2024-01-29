import express, { Express, Request, Response, Application } from "express";
import bodyParser from "body-parser";
import dotenv from 'dotenv'
import { Router } from './routes/api'
import cors from 'cors'
//For env File
dotenv.config()

const app: Application = express()
const port = process.env.PORT || 8000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

app.get("/", (req: Request, res: Response) => {
    res.send("Hello, I am Kornel")
})


app.use("/api", Router)

app.listen(port, () => {
    console.log(`server listening ${port}`)
})