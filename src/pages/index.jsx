import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { HiOutlineArrowNarrowLeft } from 'react-icons/hi'
import styled, { css } from 'styled-components'
import Image from 'next/image'

import InputText from '../components/InputText'
import ToggleSwitch from '../components/ToggleSwitch'
// import LinkText from '../components/LinkText'
import Modal from '../components/Modal'
import HeadLinks from '../components/HeadLinks'

import getDateNow from '../../src/utils/date'

import logo from '../../public/imgs/bugbank.png'

//NEW COMPONENT
import { FormLogin } from "../components"


function Index() {
  const [isLogin, setLogin] = useState(true)
  const [isChecked, setChecked] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [openModal, setOpenModal] = useState(false)
  const [modalText, setModalText] = useState('')
  const [modalType, setModalType] = useState('error')

  function callModal(message) {
    setModalType('error')
    setModalText(message)
    setOpenModal(true)
  }

  const handleBackButton = () => {
    setLogin((prevState) => !prevState)
  }

  const changeToRegister = () => {
    setLogin((prevState) => !prevState)
  }

  const handleRegister = () => {

    if (!name) {
      setModalText('Nome não pode ser vazio')
      setModalType('error')
      setOpenModal(true)

      return
    }

    if (!email) {
      setModalText('Email não pode ser vazio')
      setModalType('error')
      setOpenModal(true)

      return
    }

    if (!password) {
      setModalText('Senha não pode ser vazio')
      setModalType('error')
      setOpenModal(true)

      return
    }

    if (!passwordConfirmation) {
      setModalText('Confirmar senha não pode ser vazio')
      setModalType('error')
      setOpenModal(true)

      return
    }

    if (password !== passwordConfirmation) {
      setModalText('As senhas não são iguais')
      setModalType('error')
      setOpenModal(true)

      return
    }
    const account = generateAccountNumber()
    const user = {
      name,
      email,
      password,
      accountNumber: account,
      balance: isChecked ? 1000 : 0,
      logged: false
    }

    const initialBalance = {
      id: uuidv4(),
      date: getDateNow(),
      type: 'Abertura de conta',
      transferValue: isChecked ? 1000 : 0,
      description: isChecked ? 'Saldo adicionado ao abrir conta' : 'Cliente optou por não ter saldo ao abrir conta'
    }

    localStorage.setItem(email, JSON.stringify(user))
    localStorage.setItem(`transaction:${email}`, JSON.stringify([initialBalance]))
    setModalText(`A conta ${account} foi criada com sucesso`)
    setModalType('ok')
    setOpenModal(true)
    setLogin(true)
  }



  const generateAccountNumber = () => {
    const account = Math.floor(Math.random() * 1000);
    const digit = Math.floor(Math.random() * 10)

    return (`${account}-${digit}`)
  }

  const handleChecked = () => {
    setChecked((prevState) => !prevState)
  }

  return (
    <Background>
      <HeadLinks />
      <TitleBackground>
        <Image src={logo} width='240' height='88' placeholder='blur' />

        <Title>
          O banco com bugs e falhas do seu jeito
        </Title>
        <Text>
          Faça transferências e pagamentos com bugs e pratique testes com sucesso em um cenário quase real!
        </Text>
      </TitleBackground>
      <FormBackground>
        <Wrapper isLogin={isLogin}>
            <div className="card__login">
              <FormLogin onRegister={changeToRegister} onCallModal={callModal} />
            </div>
            <div className="card__register">
              <ContainerBackButton>
                <HiOutlineArrowNarrowLeft size={26} style={{ color: '#A422E3' }} />
                <BackText id='btnBackButton' onClick={handleBackButton} href='#'>Voltar ao login</BackText>
              </ContainerBackButton>

              <InputText
                value={email}
                onChange={(t) => setEmail(t.target.value)}
                id='inputEmail'
                label='Email'
                type='email'
              />
              <InputText
                value={name}
                onChange={(t) => setName(t.target.value)}
                id='inputName'
                label='Nome'
                type='text'
              />
              <InputText
                value={password}
                onChange={(t) => setPassword(t.target.value)}
                id='inputPassword'
                label='Senha'
                type='password'
              />
              <InputText
                value={passwordConfirmation}
                onChange={(t) => setPasswordConfirmation(t.target.value)}
                id='inputPasswordConfirmation'
                label='Confirmar senha'
                type='password'
              />

              <ContainerToggle>
                <ToggleText>
                  Criar conta com saldo ?
                </ToggleText>
                <ToggleSwitch id='toggleAddBalance' isChecked={isChecked} onClick={handleChecked} />
              </ContainerToggle>

              <Button id='btnRegister' onClick={handleRegister} secondary>Cadastrar</Button>
            </div>
        </Wrapper>
      </FormBackground>
      {openModal && (
        <Modal type={modalType} text={modalText} onClose={() => setOpenModal(false)} />
      )}
    </Background>
  )
}

const Background = styled.div`
  display: grid;
  height: 100vh;
  grid-template-columns: 60% auto;
  grid-template-areas: "title form";

  @media(max-width: 960px){
    grid-template-areas:
    "title"
    "form";
  }
`

const TitleBackground = styled.div`
  padding-top: 4rem;
  padding-left: 6rem;
  border-right: 2px solid ${(props) => props.theme.colors.primary};

  grid-area: title;

  background-image: linear-gradient(
    to right bottom, ${(props) => props.theme.colors.primary}, ${(props) => props.theme.colors.secondary});

    @media(max-width: 960px){
      width: 100vw;
      border-right: none;

      border-bottom: 2px solid ${(props) => props.theme.colors.primary};
    }
`

const FormBackground = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  grid-area: form;
  background: ${(props) => props.theme.colors.white};

  @media(max-width: 960px){
    width: 100vw;
  }
`

const Wrapper = styled.div`
  width: 35rem;
  height: ${(props) => (props.isLogin ? '42rem' : '58rem')};
  margin-top: 2rem;
  grid-area: form;
  position: relative;
  transition: transform 1s;
  transform-style: preserve-3d;
  .card__login,
  .card__register {
    position: absolute;
    height: 100%;
    width: 100%;
    backface-visibility: hidden;
  }
  .card__login {
    ${props => !props.isLogin && css`
      z-index: 0;
    `}
  }

  .card__register {
    transform: rotateY( 180deg );
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
  }

  ${props => !props.isLogin && css`
    transform: rotateY(180deg);
  `}

  @media(max-width: 460px){
    width: 20rem;
  }
`

const ContainerBackButton = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const BackText = styled.a`
  font-size: 1.8rem;
  color: ${(props) => props.theme.colors.primary};
  padding-left: 1rem;

  &:hover {
    opacity: 0.8
  }

  @media(max-width: 460px){
    font-size: 1.6rem;
  }
`

const ContainerToggle = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  @media(max-width: 760px){
    flex-direction: column;
    height: 12rem;
  }
`

const ToggleText = styled.p`
  font-size: 1.8rem;
  color: ${(props) => props.theme.colors.primary};

  @media(max-width: 760px){
    font-size: 2rem;
    line-height: 1;
    max-width: 34rem;
    margin-top: 3.5rem;
  }
`

const Button = styled.a`
  display: flex;
  width: 16rem;
  height: 5rem;
  border-radius: 0.8rem;

  align-items: center;
  justify-content: center;

  cursor: pointer;

  color: ${(props) => props.theme.colors.white};
  background: ${(props) => props.theme.colors.primary};
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.4));

  ${props => props.outline && css`
    color: ${(props) => props.theme.colors.secondary};
    background: ${(props) => props.theme.colors.white};
    border: 1px solid ${(props) => props.theme.colors.secondary};`
  }

  ${props => props.secondary && css`
    width: 100%;
    background: ${(props) => props.theme.colors.secondary};`
  }

  &:hover {
    opacity: 0.8;
  }

  @media(max-width: 760px){
    width: 100%;
  }
`

const Title = styled.h1`
  font-size: 5.4rem;
  font-weight: bold;
  line-height: 1.2;
  max-width: 40rem;
  margin-top: 6rem;
  color: ${(props) => props.theme.colors.white};

  @media(max-width: 460px){
    font-size: 3.4rem;
    font-weight: bold;
    line-height: 1;
    max-width: 24rem;
  }
`

const Text = styled.p`
  font-size: 2.4rem;
  line-height: 1.2;
  max-width: 44rem;
  margin-top: 10rem;
  color: ${(props) => props.theme.colors.white};

  @media(max-width: 760px){
    font-size: 2rem;
    line-height: 1;
    max-width: 34rem;
    margin-top: 3.5rem;
  }
`

export default Index;
