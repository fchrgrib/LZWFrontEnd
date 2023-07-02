import './App.css';
import axios,{AxiosError} from 'axios'
import {useEffect, useState} from "react";

function App() {
  const [data,setData] = useState([])
  const [type,setType] = useState("compress")
  const [algorithm,setAlgorithm] = useState("no")
  const [text,setText] = useState('')


  const fetchData = async ()=>{
    try{
      const result = await axios.get('https://lzwbackend-production.up.railway.app')
      console.log(result)
      setData(result.data)
    }catch (e) {
      if (e instanceof AxiosError) {
        const errorMsg = e.response?.data?.error;
        console.log(errorMsg)
      }
    }
  }
  const postData = async ()=>{
    if (text!==''&&text!==' '){
      console.log(`${text} ${type} ${algorithm}`)
      try {
        const response = await axios.post('https://lzwbackend-production.up.railway.app/data',{
          input:text,
          type:type,
          choice:algorithm,
        })
        if (response.data.status==='ok') await fetchData()
      }catch (e){
        console.log(e)
      }
    }
  }

  useEffect(() =>{
    fetchData()
  },[])
  
  return (
      <div className="h-screen flex justify-center">
        <div className="flex-col mt-[10rem]">
          <div className="flex-col items-center h-12">
            <input type='text' name='text' className="w-[40rem] font-thin h-12 px-2 text-lg border border-gray-300 rounded-l-lg outline-none focus:border-blue-400" onChange={e=>{setText(e.target.value)}}/>
            <button className="self-center bg-fuchsia-400 h-12 w-[5rem] rounded-r-md font-sans text-lime-50 font-semibold" onClick={postData}>POST</button>
          </div>
          <div className="flex-col font-thin">
            Choose type:
            <input className="ml-2" type="radio" value="decompress" onChange={e=>setType(e.target.value)} checked={type==="decompress"}/> Decompress
            <input className="ml-2" type="radio" value="compress" onChange={e=>setType(e.target.value)} checked={type==="compress"}/> Compress
          </div>
          <div className="flex-col font-thin">
            With Run Length Encoding Algorithm? :
            <input className="ml-2" type="radio" value="yes" onChange={e=>setAlgorithm(e.target.value)} checked={algorithm==="yes"}/> yes
            <input className="ml-2" type="radio" value="no" onChange={e=>setAlgorithm(e.target.value)} checked={algorithm==="no"}/> no
          </div>
          <div className="w-[35rem] h-auto flex-col">
            {
              data&&data.map((item)=>{
                  return(
                      <div className="w-[45rem] h-auto border border-gray-200 flex-none relative">
                        <div className="w-[45rem] h-auto flex justify-between rounded-lg p-4 my-1">
                          <div className="flex-col">
                            <div className="font-semibold">Input</div>
                            <div className="font-normal w-[9rem]">{item.input}</div>
                          </div>
                          <div className="flex-col">
                            <div className="font-semibold">Algoritma</div>
                            <div className="font-normal w-[9rem]">{item.algorithm}</div>
                          </div>
                          <div className="flex-col">
                            <div className="font-semibold">Output</div>
                            <div className="font-normal w-[9rem]">{item.output}</div>
                          </div>
                          <div className="flex-col">
                            <div className="font-semibold">Created At</div>
                            <div className="font-normal">{item.createdAt}</div>
                          </div>
                        </div>
                        <button className="absolute bottom-0 end-0 bg-pink-400 m-4 p-2 rounded-lg font-semibold text-lime-50" onClick={async ()=>{
                          await axios.delete(`https://lzwbackend-production.up.railway.app/${item.id}/delete`)
                              .then((response)=>{
                                if (response.data.status==="ok") fetchData()
                              })
                        }}>
                          DELETE
                        </button>
                      </div>
                  )
                })
            }
          </div>
        </div>
      </div>
  );
}

export default App;
