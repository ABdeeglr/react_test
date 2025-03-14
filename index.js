const express = require('express')
const cors = require('cors')

const app = express()

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}


app.use(cors())
app.use(express.json())
app.use(requestLogger)
app.use(express.static('dist'))

let notes = [
    {
        id: 1,
        content: "HTML is easy",
        date: "2019-05-30T17:30:31.098Z",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only Javascript",
        date: "2019-05-30T18:39:34.091Z",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        date: "2019-05-30T19:20:14.298Z",
        important: true
    }
]



app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
    response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
    const id = request.params.id
    // const now = new Date();
    // console.log("Log:", now ,request)
    const note = notes.find(note => note.id === Number(id)) // 需要判定 id 的类型，应该记住路由规则中都是字面量
    if (note) {
        response.json(note)
    } else {
        response.status(404).end('<h1>404 Not Found</h1>')
        // end 能够结束 http 响应，在这里其实不需要发送数据，因为状态码已经说明了一切。
        // 特别是因为后端服务器是面向应用程序而非用户使用的，所以 `end()` 内部不需要参数。
    }
})

app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id

    // 用过滤后的新数组替换原数组
    notes = notes.filter(note => note.id !== Number(id))

    response.status(204).end()
})

app.post('/api/notes', (request, response) => {

    // console.log(request.headers) // on debugging: 打印请求头

    if (!request.body) {
        return response.status(400).json({ error: 'content missing' })
    }

    const note = {
        content: request.body.content,
        important: request.body.important || false,
        date: new Date(),
        id: notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 0
    }

    notes = notes.concat(note)
    response.json(note)
})

app.use(unknownEndpoint)
// 开启端口监听
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
