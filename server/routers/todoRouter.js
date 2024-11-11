import { pool } from '../helpers/db.js'
import { Router } from 'express'
import { emptyOrRows } from '../helpers/utils.js'
import { auth } from '../helpers/auth.js'

const router = Router()

router.get('/', async (req,res,next) => {
    try {
        const result = await pool.query('select * from task')
        res.status(200).json(emptyOrRows(result))
    } catch (error) {
        next(error)
    }
})

router.post('/create', auth, async (req,res,next) => {
    try {
        const { description } = req.body
        const result = await pool.query(
            'insert into task (description) values ($1) returning *',
        [description]
        )
        res.status(200).json({ id: result.rows[0].id })
    } catch (error) {
        next(error)
    }
})

router.delete('/delete/:id', auth, async (req,res,next) => {
    try {
        const id = parseInt(req.params.id)
        await pool.query('delete from task where id = $1', [id])
        res.status(200).json({ id })
    } catch (error) {
        next(error)
    }
})

export default router