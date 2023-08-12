<script>

    import { v4 as uuidv4 } from 'uuid'
    import axios from 'axios'

    let email = ''
    /**
     * @type {any}
     */
    let file

    let uploadStatus = 'uploading....'

    const onUpload = () => {
        console.log(file)
    }

    const handleEmail = () => {
        localStorage.setItem('email', email)
    }

</script>


<div>
    <input type="text" name="email" bind:value={email} />
    <button on:click={() => handleEmail()}>Enter Email</button>
    <h1>File upload status {uploadStatus}</h1>

    <input type="file" name="file" bind:value={file} />
    <button on:click={() => onUpload()}>Upload</button>
</div>