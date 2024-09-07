import { useCallback, useEffect, useState } from 'react'
import {useDropzone} from 'react-dropzone';
import Hashloader from 'react-spinners/PulseLoader';
import styled from 'styled-components';

const  DropZone = ( { 
  setStatus,
  setimageurl,
  detector,
  setResult,
  className,
}) => {
 
  const [files, setFiles] = useState([])
  const [rejected, setRejected] = useState([])

  const onDrop = useCallback(
    (accepted, rejected ) => {
      if (accepted?.length) {
        setFiles([
          ...accepted.map(file =>
            Object.assign(file, { preview: URL.createObjectURL(file) })
          )
        ])

        setStatus('ready')
        setResult(null)

        const reader = new FileReader()

        reader.onload = function (e) {
          const image = e?.target?.result
          detector(image);
          setimageurl(image);
        }
        reader.readAsDataURL(accepted[0])
      }
      if (rejected?.length) {
        setRejected(rejected)
      }
    },
    [detector, setResult, setStatus]
  )
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': []
    },
    maxSize: 1024 * 1000,
    maxFiles: 1,
    onDrop
  })

  useEffect(() => {
    return () => files.forEach(file => URL.revokeObjectURL(file.preview))
  }, [files])

  

  const remove = () => {
    setFiles([])
    setRejected([])
  }

  return (
    <>
    <Dropbox_style>
      <div
        {...getRootProps({
          className: className
        })}
      >
        <input {...getInputProps({ name: 'file' })} />
        <div className='upload-container'>
            <div className="info-upload">
              {
                (!files[0] ) ? ("Upload") : (
                  <div><Hashloader color="white" size="10px"/></div>
                )
              }
            </div>
              <div className="comment-info">
              {
                (!files[0]) ? (<div>No image is selected</div>) : (<div>Image is processing ...</div>)
              }
              </div>
        </div>
      </div>
      </Dropbox_style>
    </>
  )
}

const Dropbox_style = styled.div`

.upload-container{
    
    color: black;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-weight: 500;
    display: flex;
    align-items: center;
    flex-flow:row;
    justify-content: space-evenly;
    color:whitesmoke;
    .info-upload{
        display: flex;
        flex-flow: row;
        align-items: center;
        justify-content: center;
        background-color: #cd9400;
        padding: 5px;
        width: 100px;
        font-weight: 900;
        height: 20px;
        border-radius: 10px;
    }
    .info-upload:hover{
      background-color: #ffae00;
      color:whitesmoke;
      border:none;
    }
}


` 

export default DropZone;