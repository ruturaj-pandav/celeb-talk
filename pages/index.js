import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [celeb, setCeleb] = useState("")
  const [celebInfo, setCelebInfo] = useState([])
  const [showTable, setShowTable] = useState(false)
  const [chat, setChat] = useState(false)

  const [question, setQuestion] = useState("")
  const [image, setImage] = useState(null)
  const [messages, setMessages] = useState([])

  function handleImageChange(e) {
    setImage(e.target.files[0])
  }


  async function find() {
    console.log("finding1")
    let formData = new FormData()
    console.log(image)
    formData.append('celebrity', image)
    formData.append('test', "test")
    console.log("finding2")
    const response = await fetch('http://localhost:8000/find', {
      method: 'POST',
      body: formData,

    })
    console.log("finding3"), response
    const data = await response.json()
    console.log("finding 4 : ", data)

    setCeleb(data.name)
    // 

  }

  useEffect(() => {
    getCelebInformation();
  }, [celeb])
  // async function recognize() {
  //   const response = await fetch('http://localhost:8000/celeb')
  // }
  async function getCelebInformation() {

    if (celeb === "") {
      return
    }
    else {
      console.log("getting celeb information:  ", celeb)
      const response = await fetch(`https://api.api-ninjas.com/v1/celebrity?name=${celeb}`, { headers: { "X-Api-Key": "WNHYvgHsXaGs2wmIwstXAQ==AcsG5m2CV3p9cfB4" } })
      const data = await response.json()
      console.log("celeb dat : ", data)
      if (data.length > 0) {
        let celebrityInformation = {}
        celebrityInformation.name = data[0].name
        celebrityInformation.age = data[0].age
        celebrityInformation.gender = data[0].gender
        celebrityInformation.birthday = data[0].birthday
        celebrityInformation.height = data[0].height
        celebrityInformation.nationality = data[0].nationality
        celebrityInformation.occupation = data[0].occupation
        setCelebInfo(celebrityInformation)
        setShowTable(true)
      }
      else {
        setShowTable(false)
      }
    }
  }



  async function Conversation() {
    console.log("conv1")

    let prompt = `You are ${celeb}. Use all the information that you have  and provide accurate information. Question : ${question}`

    console.log("conv2", prompt)

  
    setMessages( message => [...message, {
      "speaker": "user",
      "content": question
      
    }]);
    let bodyData = { prompt };
    console.log("conv3")
    const response = await fetch('http://localhost:8000/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    })
    console.log("conv4 : ", response)
    const data = await response.json()
    console.log("conv5 : ", data)


   
    

    setMessages( message => [...message, {
      "speaker": "bot",
      "content": data.answer
      
    }]);
  }
  async function firstMessage() {
    console.log("fm1")

    let prompt = `You are ${celeb}.Greet the user.  `
    console.log("fm2")
    let bodyData = { prompt };
    const response = await fetch('http://localhost:8000/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    })
    console.log("fm3 : ", response)
    const data = await response.json()
    console.log("data : ", data)

    setMessages( message => [...message, {
      "speaker": "bot",
      "content": data.answer
      
    }]);

  }


  useEffect(() => {
    if (chat === true && messages.length == 0) {
      firstMessage();
    }
  }, [chat])


  useEffect(() => {
    getCelebInformation()
  }, [])
  return (
    <main
      className={`flex min-h-screen flex-col items-center py-32 container mx-auto ${inter.className}`}
    >
      <div className="grid grid-cols-2 ">
        <div>
          <input name="celebrity" type="file" className="" onChange={handleImageChange} />
          <button onClick={() => { find() }}>Find Celebrity</button>
        </div>
        <div>

          {showTable && <> <table class="table-auto border ">
            <thead>
              <tr>
                <th class="border">Attribute</th>
                <th class="border">Information</th>

              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="border">Name</td>
                <td class="border">{celebInfo.name}</td>
              </tr>
              <tr>
                <td class="border">Gender</td>
                <td class="border">{celebInfo.gender}</td>
              </tr>
              <tr>
                <td class="border">Nationality</td>
                <td class="border">{celebInfo.nationality}</td>
              </tr>
              <tr>
                <td class="border">Occupation</td>
                <td class="border">{celebInfo.occupation.map((work, index) => {
                  return (
                    <span className="mr-2 inline-block">{work}</span>
                  )
                })}</td>
              </tr>

              <tr>
                <td class="border">Birthday</td>
                <td class="border">{celebInfo.birthday}</td>
              </tr>

            </tbody>
          </table>
            <br /><span onClick={() => {
              setChat(true)
            }}>Chat with {celeb} now</span> </>}

        </div>
      </div>
      {true && <div className="border border-gray-700 rounded-[3px] w-full h-[100vh] overflow-y-scroll border  flex flex-col justify-between ">
        

        <div>
          {messages.map((message, index) => {
            return <div className={`${message.speaker === 'bot' ? 'bg-green-300' : "bg-red-300"}`}>
              {message.content}
            </div>
          })}
        </div>

       <div>
       < input type="text" className="w-full bg-transparent border border-gray-500 rounded-[3px] py-[10px] px-[2px] text-[14px] " onChange={(e) => { setQuestion(e.target.value) }} />
        <button className=" bg-white text-black rounded-[2px] hover:bg-gray-200 duration-100" onClick={() => {
          Conversation();
        }} >Ask Question</button>
       </div>
      </div>}
    </main>
  )
}
