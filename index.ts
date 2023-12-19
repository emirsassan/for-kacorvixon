import express, {Request, response, Response} from "express"
import { Surreal } from "surrealdb.js";
import { z } from "zod";
import config from "./config.json";

const app = express()

app.use(express.urlencoded({extended: true}));
app.use(express.json())

const db = new Surreal();

const Product = z.object({
    name: z.string(),
    description: z.string(),
    stan: z.object({
        text: z.string(),
        other: z.string()
    })
})

app.get("/prod/:id", async (req: Request, res: Response) => {
    const id = req.params.id

    if (!id) {
        return response.status(400).json({
            message: "you should provide a product id"
        })
    }

    await db.connect("http://127.0.0.1:8000/rpc", {
        namespace: 'kacor',
        database: 'products',

        auth: {
            username: config.db.username,
            password: config.db.passwd,
        }
    })

    const shit = await db.select("product:" + id)

    return res.status(200).json(shit)
})

app.post("/prod/all", async (req: Request, res: Response) => {
    try {
        const { key } = req.body

        if (!key) {
            return res.status(400).json({
                message: "invalid key"
            })
        }

        if (key == config.key) {
            await db.connect("http://127.0.0.1:8000/rpc", {
                namespace: 'kacor',
                database: 'products',

                auth: {
                    username: config.db.username,
                    password: config.db.passwd,
                }
            })

            const shit = await db.select("product")

            return res.status(200).json({
                shit
            })
        } else {
            return res.status(200).json({
                message: "are you tanmay?"
            })
        }
    } catch (e) {
        return res.status(400).json({
            error: "408"
        })
    }
})

app.post("/prod/add", async (req: Request, res: Response) => {
    try {
        const body = req.body

        const product = Product.parse(body)

        await db.connect("http://127.0.0.1:8000/rpc", {
            namespace: 'kacor',
            database: 'products',

            auth: {
                username: config.db.username,
                password: config.db.passwd,
            }
        })

        await db.create("product", {
            product,
            tify: Math.random().toString(36).slice(2, 12)
        })

        return res.status(200).json({
            message: "great!"
        })
    } catch (e) {
        if (e instanceof z.ZodError) {
            return res.status(400).json({
                error: e.issues
            })
        }
    }
})

app.listen(3131, async () => {
    console.log("http://localhost:3131")
})