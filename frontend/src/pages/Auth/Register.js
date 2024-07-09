import './Auth.css'

//Components
import { Link } from 'react-router-dom'
import Message from '../../components/Message'

//Hooks
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"

//redux
import { register, reset } from '../../slices/authSlice'



const Register = () => {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  //uso do dispatch, permite utilizar as funçoes do redux
  const dispatch = useDispatch();

  // A linha const { loading, error } = useSelector((state) => state.auth); conecta o componente React ao estado gerenciado pelo authSlice. As ações definidas em authSlice, como register, login e logout, modificam esse estado, e useSelector permite que o componente React reaja a essas mudanças de estado.
  const { loading, error } = useSelector((state) => state.auth);


  const handleSubmit = (e) => {
    e.preventDefault();

    const user = {
      name,
      email,
      password,
      confirmPassword
    }

  

    dispatch(register(user))


  };

  //limpar os estados do redux que o componente consome Quando o componente é montado, ele despacha a ação reset para garantir que qualquer estado residual de operações anteriores (como carregamento, sucesso ou erros) seja limpo, proporcionando um estado inicial limpo.
  useEffect(() => {

    dispatch(reset())

  }, [dispatch])



  return (
    <div id="register">
      <h2>ReactGram</h2>
      <p className='subtitle'>Cadastre-se para ver as fotos dos seus amigos</p>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder='Nome' onChange={(e) => setName(e.target.value)} value={name} />
        <input type="email" placeholder='E-mail' onChange={(e) => setEmail(e.target.value)} value={email} />
        <input type="password" placeholder='Senha' onChange={(e) => setPassword(e.target.value)} value={password} />
        <input type="password" placeholder='Confirme a senha' onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} />
        {!loading && <input type="submit" value="Cadastrar" />}
        {loading && <input type="submit" value="Aguarde" disabled/>}
        {error && <Message msg={error} type="error" />}

      </form>

      <p>
        Já tem conta? <Link to="/login">Clique aqui.</Link>
      </p>
    </div>
  )
}

export default Register