import React, { useCallback, useRef } from 'react';
import { FiArrowLeft, FiMail, FiLock, FiUser } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import getValidationErros from '../../utils/getValidationErros';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, Background } from './styles';

const SingUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  // eslint-disable-next-line @typescript-eslint/ban-types
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

  // eslint-disable-next-line @typescript-eslint/ban-types
  const handleSubmit = useCallback(async () => {
    await validateForm();
  }, [validateForm]);

  return (
    <Container>
      <Background />
      <Content>
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

        <a href="adasd">
          <FiArrowLeft />
          Voltar para Logon
        </a>
      </Content>
    </Container>
  );
};

export default SingUp;
