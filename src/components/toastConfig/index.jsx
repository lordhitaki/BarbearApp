import React from 'react';

import {Title} from '../title';

import * as Styled from './styles';

const ToastConfig = {
  success: ({text1, text2, props}) => (
    <Styled.BoxToastSuccess>
      <Title
        text="Feito!"
        align="center"
        family="bold"
        size="medium"
        marginTop="nano"
      />
      <Title text="Tarefa Feita, removida de sua agenda!" align="center" />
    </Styled.BoxToastSuccess>
  ),
  error: ({text1, text2, props}) => (
    <Styled.BoxToastError>
      <Title
        text="Erro"
        align="center"
        family="bold"
        size="medium"
        marginTop="nano"
      />
      <Title text={text2} align="center" />
    </Styled.BoxToastError>
  ),
  PhoneAdd: props => (
    <Styled.BoxToastSuccess>
      <Title
        text="Sucesso"
        align="center"
        family="bold"
        size="medium"
        marginTop="nano"
      />
      <Title text="O número foi adicionado com sucesso" align="center" />
    </Styled.BoxToastSuccess>
  ),
  ScheduledAdd: props => (
    <Styled.BoxToastSuccess>
      <Title
        text="Sucesso"
        align="center"
        family="bold"
        size="medium"
        marginTop="nano"
      />
      <Title text="Pedido adicionado com sucesso!" align="center" />
    </Styled.BoxToastSuccess>
  ),
  LoginSuccess: props => (
    <Styled.BoxToastSuccess>
      <Title
        text="Sucesso"
        align="center"
        family="bold"
        size="medium"
        marginTop="nano"
      />
      <Title text="Login Feito com sucesso!" align="center" />
    </Styled.BoxToastSuccess>
  ),
  ErrorAdd: props => (
    <Styled.BoxToastError>
      <Title
        text="Erro"
        align="center"
        family="bold"
        size="medium"
        marginTop="nano"
      />
      <Title
        text="Selecione um profissional, serviço e horário para agendar!"
        align="center"
      />
    </Styled.BoxToastError>
  ),
  ErrorBD: props => (
    <Styled.BoxToastError>
      <Title
        text="Erro"
        align="center"
        family="bold"
        size="medium"
        marginTop="nano"
      />
      <Title
        text="'Erro ao consultar o banco de dados,por favor tente novamente! "
        align="center"
      />
    </Styled.BoxToastError>
  ),
  ErrorSche: props => (
    <Styled.BoxToastError>
      <Title
        text="Erro"
        align="center"
        family="bold"
        size="medium"
        marginTop="nano"
      />
      <Title
        text="Você precisa selecionar um profissional, serviço e horario para agendar "
        align="center"
      />
    </Styled.BoxToastError>
  ),
  ErrorAdd1: props => (
    <Styled.BoxToastError>
      <Title
        text="Erro"
        align="center"
        family="bold"
        size="medium"
        marginTop="nano"
      />
      <Title
        text="Erro ao adicionar o pedido, por favor tente novamente! "
        align="center"
      />
    </Styled.BoxToastError>
  ),
  LogoutSuccess: props => (
    <Styled.BoxToastSuccess>
      <Title
        text="Feito"
        align="center"
        family="bold"
        size="medium"
        marginTop="nano"
      />
      <Title text="Você foi deslogado " align="center" />
    </Styled.BoxToastSuccess>
  ),
  CancelOrder: props => (
    <Styled.BoxToastSuccess>
      <Title
        text="Feito"
        align="center"
        family="bold"
        size="medium"
        marginTop="nano"
      />
      <Title text="Agendamento cancelado!" align="center" />
    </Styled.BoxToastSuccess>
  ),
  ScheduledSuccess: props => (
    <Styled.BoxToastSuccess>
      <Title
        text="Feito"
        align="center"
        family="bold"
        size="medium"
        marginTop="nano"
      />
      <Title text="Agenda atualizada com sucesso" align="center" />
    </Styled.BoxToastSuccess>
  ),
};

export default ToastConfig;
