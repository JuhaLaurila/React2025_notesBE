require('dotenv').config()
const express = require('express')
const app = express()
const Note = require('./models/note')

/* const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2] 

// ÄLÄ KOSKAAN TALLETA SALASANOJA GitHubiin!
const url = `mongodb+srv://Passwoortti:${password}@cluster0.vqvldvv.mongodb.net/UusiTestiApp2?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    
  }
})

const Note = mongoose.model('Note', noteSchema)
*/
app.use(express.json())

const cors = require('cors')

app.use(cors())

app.use(express.static('dist'))





let notes = [
    {
      id: "1",
      content: "HTML is tossii tositosi iisiä",
      important: true
    },
    {
      id: "2",
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: "3",
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
  ]
  app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })

  app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
      response.json(notes)
    })
  })

  app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id
    notes = notes.filter(note => note.id !== id)
  
    response.status(204).end()
  })

  const generateId = () => {
    const maxId = notes.length > 0
      ? Math.max(...notes.map(n => Number(n.id)))
      : 0
    return String(maxId + 1)
  }
  
  app.post('/api/notes', (request, response) => {
    const body = request.body
  
    if (!body.content) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }
  
    const note = {
      content: body.content,
      important: body.important || false,
      id: generateId(),
    }
  
    notes = notes.concat(note)
  
    response.json(note)
  })

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)
 
  const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })

  