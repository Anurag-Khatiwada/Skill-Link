import React, {useState} from 'react';
import "./Login.css";
import { useNavigate } from 'react-router-dom';
import newRequest from "../../utils/newRequest"

const Login = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [close, setClose] = useState(false);
  const [type, setType] = useState("password");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleClose = (e)=>{
    e.preventDefault()
    setClose(!close);
    if(close===true){
      setType("password");
    }else{
      setType("text");
    }
    console.log(close);
  }

  const handleSubmit = async (e)=>{
    e.preventDefault();
    try{
      const res = await newRequest.post("/auth/login",{
        username,
        password
      });
      localStorage.setItem("currentUser", JSON.stringify(res.data))
      navigate("/")
    }catch(err){
      setError(err.response.data)
    }

  }

  return (
    <div className="login">
      <form onSubmit={handleSubmit} >
        <h1>Sign in</h1>
        <label htmlFor="">Username</label>
        <input onChange = {(e) => setUsername(e.target.value) } type="text" name='username' placeholder="Username" />
        <label htmlFor="">Password</label>
        <div className='inputpass'>
          <input onChange = { (e) => setPassword(e.target.value)} type={type} name='password' placeholder='password' />
          <button onClick={handleClose} className="eyeopen">
          {!close && (<img src="/public/img/eyeopen.svg" alt="" />)}
            {close && (
              <img src="/public/img/eyeclose.svg" alt="" />
            )}
         </button>
        </div>
        <button className='submit' type="submit">Login</button>
        {error && error}
      </form>
    </div>
  )
}

export default Login
