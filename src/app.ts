import * as express from 'express'

import type { Request, Response } from 'express'
import * as bodyParser from 'body-parser'
import { createConnection } from 'typeorm'
import { User } from './entity/User'

createConnection().then(connection => {
  const userRepository = connection.getRepository(User)

  const app = express()
  app.use(bodyParser.json())

  app.get('/users', async (req: Request, res: Response) => {
    const users = await userRepository.find()
    console.log('users', users)
    res.json(users)
  })

  app.get('/users/:id', async (req: Request, res: Response) => {
    const user = await userRepository.findOne({
      where: { id: Number(req.params.id) }
    })
    res.json(user)
  })

  app.post('/users', async function (req: Request, res: Response) {
    // 保存用户信息的逻辑操作
    const user = userRepository.create(req.body)
    await userRepository.save(user)
    res.json(user)
  })

  app.put('/users/:id', async function (req: Request, res: Response) {
    // 根据给定id更新某个用户的逻辑操作
    const user = await userRepository.findOne({
      where: { id: Number(req.params.id) }
    })
    const newUser = await userRepository.update(user, {
      firstName: 'new first name'
    })
    res.json(newUser)
  })

  app.delete('/users/:id', async function (req: Request, res: Response) {
    // 根据给定id删除一个用户的逻辑操作
    const user = await userRepository.findOne({
      where: { id: Number(req.params.id) }
    })
    if (user) {
      await userRepository.delete(user)
      res.status(200).json(user)
    } else {
      res.status(404).json({
        msg: '不存在此用户'
      })
    }
  })

  // 启动 express 服务
  app.listen(3000)
})
