import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import LogoHorizontal from '@/assets/icons/logo-horizontal.svg'
import Pets from '@/assets/icons/pets.svg'
import { useCoordinates } from '@/hooks/use-location'
import { api } from '@/services/http'
import { cepRegex } from '@/utils/regex'
import { InputText, InputTextPassword } from '~/Input'
import { MapPet } from '~/MapPet'

import {
  Button,
  Buttons,
  Card,
  Container,
  Form,
  FormWrapper,
  Wrapper,
} from './styles'

const registerSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email(),
  address: z.string().min(3).max(50),
  cep: z.string().regex(cepRegex).min(8).max(9),
  whatsappNumber: z.string().min(14).max(14),
  password: z.string().min(6).max(50),
  passwordConfirm: z.string().min(6).max(50),
})

type RegisterForm = z.infer<typeof registerSchema>

export function Register() {
  const {
    formState: { errors },
    handleSubmit,
    register,
    watch,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const coordinates = useCoordinates(watch('cep'))
  const navigate = useNavigate()

  async function handleRegisterOrganization(form: RegisterForm) {
    if (!form) return
    try {
      await api.post('/orgs', form)
      handleLoginOrganization()
    } catch (err) {
      console.log(err)
    }
  }

  function handleLoginOrganization() {
    navigate('/login')
  }

  return (
    <Wrapper>
      <Container>
        <Card>
          <img src={LogoHorizontal} className="logo" alt="" />
          <img src={Pets} alt="" />
        </Card>
        <FormWrapper>
          <h1>Cadastre sua organização</h1>
          <Form onSubmit={handleSubmit(handleRegisterOrganization)}>
            <InputText
              label="Nome"
              placeholder="Find Friend"
              errorMessage={errors.name?.message}
              {...register('name')}
            />

            <InputText
              label="Email"
              placeholder="find_friend@email.com"
              errorMessage={errors.email?.message}
              {...register('email')}
            />

            <InputText
              label="CEP"
              placeholder="12345678"
              errorMessage={errors.cep?.message}
              {...register('cep')}
            />

            <InputText
              label="Endereço"
              placeholder="Rua do Pet, 1825"
              errorMessage={errors.address?.message}
              {...register('address')}
            />

            <MapPet
              coordinates={coordinates}
              popupText={`Localização Organização`}
            />

            <InputText
              label="Whatsapp"
              placeholder="99 99999 9999"
              errorMessage={errors.whatsappNumber?.message}
              {...register('whatsappNumber')}
            />

            <InputTextPassword
              label="Senha"
              placeholder="Senha"
              errorMessage={errors.password?.message}
              type="password"
              {...register('password')}
            />

            <InputTextPassword
              label="Confirmar senha"
              placeholder="Confirme sua senha"
              errorMessage={errors.passwordConfirm?.message}
              type="password"
              {...register('passwordConfirm')}
            />

            <Buttons>
              <Button type="submit" className="primary">
                Cadastrar
              </Button>
            </Buttons>
          </Form>
        </FormWrapper>
      </Container>
    </Wrapper>
  )
}
