import React, { useRef, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { FormHandles, UnformErrors } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';

import getValidationErros from '../../utils/getValidationErros';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, AnimationContainer, Background } from './styles';

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();

  const { signIn } = useAuth();

  const { addToast } = useToast();

  const validateForm = useCallback(async () => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object({
        email: Yup.string()
          .required('Email é obrigatório')
          .email('Digite um e-mail válido'),
        password: Yup.string().required('Senha é obrigatório'),
      });

      await schema.validate(formRef.current?.getData(), {
        abortEarly: false,
      });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors = getValidationErros(error);

        formRef.current?.setErrors(errors);
      }
    }
  }, []);

  const handleSubmit = useCallback(
    async (data: SignInFormData) => {
      await validateForm();

      const errors = formRef.current?.getErrors();

      if (!Object.keys(errors as UnformErrors).length) {
        try {
          await signIn({
            email: data.email,
            password: data.password,
          });

          history.push('/dashboard');
        } catch (error) {
          addToast({
            type: 'error',
            title: 'Erro na Autenticação',
            description:
              'Ocorreu um erro ao fazer login, cheque as credenciais.',
          });
        }
      }
    },
    [validateForm, signIn, addToast, history],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu logon</h1>

            <Input
              placeholder="E-mail"
              name="email"
              icon={FiMail}
              onChange={validateForm}
            />
            <Input
              type="password"
              placeholder="Senha"
              name="password"
              icon={FiLock}
              onChange={validateForm}
            />

            <Button type="submit">Entrar</Button>

            <a href="/forgot">Esqueci minha senha</a>
          </Form>

          <Link to="/signup">
            <FiLogIn />
            Criar Conta
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default SignIn;
