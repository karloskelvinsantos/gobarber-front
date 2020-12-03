import React, { useCallback, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft, FiMail, FiLock, FiUser } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import getValidationErros from '../../utils/getValidationErros';
import { useToast } from '../../hooks/toast';

import api from '../../services/apiClient';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, AnimationContainer, Background } from './styles';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SingUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const validateForm = useCallback(async () => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object({
        name: Yup.string().required('Nome é obrigatório'),
        email: Yup.string()
          .required('Email é obrigatório')
          .email('Digite um e-mail válido'),
        password: Yup.string().min(6, 'No mínimo 6 dígitos'),
      });

      await schema.validate(formRef.current?.getData(), {
        abortEarly: false,
      });
    } catch (error) {
      const errors = getValidationErros(error);

      formRef.current?.setErrors(errors);
    }
  }, []);

  const handleSubmit = useCallback(
    async (data: SignUpFormData) => {
      await validateForm();

      try {
        await api.post('/users', data);

        history.push('/');

        addToast({
          type: 'success',
          title: 'Cadastro Realizado',
          description:
            'Cadastro realizado com sucesso. Você já pode fazer logon no GoBarber.',
        });
      } catch (error) {
        addToast({
          type: 'error',
          title: 'Erro no Cadastro',
          description: 'Ocorreu algum erro no cadastro, tente novamente.',
        });
      }
    },
    [validateForm, addToast, history],
  );

  return (
    <Container>
      <Background />
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu cadastro</h1>

            <Input
              placeholder="Nome"
              name="name"
              icon={FiUser}
              onChange={validateForm}
            />
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

            <Button type="submit">Cadastrar</Button>
          </Form>

          <Link to="/">
            <FiArrowLeft />
            Voltar para Logon
          </Link>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default SingUp;
