import React, { useRef, useCallback } from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';

import getValidationErros from '../../utils/getValidationErros';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, Background } from './styles';

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { user, signIn } = useAuth();

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

      try {
        await signIn({
          email: data.email,
          password: data.password,
        });
      } catch (error) {
        addToast({
          type: 'error',
          title: 'Erro na Autenticação',
          description: 'Ocorreu um erro ao fazer login, cheque as credenciais.',
        });
      }
    },
    [validateForm, signIn, addToast],
  );

  return (
    <Container>
      <Content>
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

        <a href="adasd">
          <FiLogIn />
          Criar Conta
        </a>
      </Content>
      <Background />
    </Container>
  );
};

export default SignIn;
