import { useState } from 'react';
import styled from 'styled-components';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');

  const isFormValid =
    name &&
    email &&
    password &&
    confirmPassword &&
    password === confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(
      'Signup submitted:',
      name,
      email,
      password,
      confirmPassword,
      role
    );
    // Add your signup logic here
  };

  return (
    <FormContainer>
      <h2>Sign Up</h2>
      <Form onSubmit={handleSubmit}>
        <Input
          placeholder="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          placeholder="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <RadioButtonContainer>
          <RadioButtonLabel>
            <RadioButton
              checked={role === 'user'}
              type="radio"
              value="user"
              onChange={() => setRole('user')}
            />
            User
          </RadioButtonLabel>
          <RadioButtonLabel>
            <RadioButton
              checked={role === 'admin'}
              type="radio"
              value="admin"
              onChange={() => setRole('admin')}
            />
            Admin
          </RadioButtonLabel>
        </RadioButtonContainer>
        <Button disabled={!isFormValid} type="submit">
          Sign Up
        </Button>
      </Form>
    </FormContainer>
  );
};

export default SignUp;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const Input = styled.input`
  padding: 10px;
  width: 200px;
  border: 1px solid gray;
  border-radius: 5px;
`;

const RadioButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const RadioButtonLabel = styled.label`
  display: flex;
  align-items: center;
`;

const RadioButton = styled.input``;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;