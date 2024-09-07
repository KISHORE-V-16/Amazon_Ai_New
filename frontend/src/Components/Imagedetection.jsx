import { useCallback, useEffect, useRef, useState } from 'react'
import React from 'react'
import Dropzone from '../Components/DropZone';


const Imagedetection = ({setobject_result,setimageurl}) => {

    const worker = useRef(null);

  const [ready,setReady] = useState(false);
  const [status,setStatus] = useState('');
  const [result,setResult] = useState('');

  useEffect(()=>{
    console.log(result);
    setobject_result(result);
  },[result]);


  // We use the `useEffect` hook to setup the worker as soon as the `App` component is mounted.
  useEffect(() => {
    if (!worker.current) {
      // Create the worker if it does not yet exist.
      worker.current = new Worker(new URL('../lib/worker.jsx', import.meta.url), {
          type: 'module'
      });
    }
    

      const onMessageReceived = (e) =>{
        switch (e.data.status) {
          case 'initiate':
            setReady(false);
            setStatus('initiate');
            break;
          case 'ready':
            setStatus('ready');
            setReady(true);
          break;
          case 'complete':
            setStatus('complete');
            setResult(e.data.result);  
          break;
          default:
            break;
        }
      }
    // Attach the callback function as an event listener.
    worker.current.addEventListener('message', onMessageReceived);

    // Define a cleanup function for when the component is unmounted.
    return () => worker.current.removeEventListener('message', onMessageReceived);
  });

  const detector = useCallback((image)=>{
    if(worker.current){
      worker.current.postMessage({image});
    }
  },[]);


  return (
    <div>
        <Dropzone
          status={status}
          setStatus={setStatus}
          detector={detector}
          result={result}
          setResult={setResult}
          setimageurl={setimageurl}
          className='drobbox'
        />
         
    </div>
  )
}

export default Imagedetection
