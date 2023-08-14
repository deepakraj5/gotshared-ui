import './App.css'
import { useState } from 'react'
import axios from 'axios'

const App = () => {

  const [email, setEmail] = useState('')
  const [file, setFile] = useState('')
  const [progress, setProgress] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const formData = new FormData()

  const handleOnUpload = async () => {
    formData.append('email', email)
    formData.append('name', file.name)
    formData.append('format', file.name.split('.')[1])
    formData.append('file', file)

    const data = await axios.post('http://localhost:5002/api/v1/upload', formData, {
      onUploadProgress: (progressEvent) => {
        setProgress(Math.round(progressEvent.loaded / progressEvent.total * 100))
      }
    })
    console.log(data)

    if(data.status === 200) {
      setIsCompleted(true)
    }

  }

  return (

    <div>

      <h2 className="title">Got Shared - Sharing made easy</h2>

      <p>Progress: {progress}</p>
      <p>{isCompleted ? 'Completed' : 'Uploading...'}</p>

      <div>
        <div>
          Email: <input type="email" label="email" value={email} onChange={e => setEmail(e.target.value)} />
          <input type="file" onChange={e => setFile(e.target.files[0])} />
          <button onClick={() => handleOnUpload()}>Upload</button>
        </div>
      </div>
    </div>
    

  )

}

export default App
