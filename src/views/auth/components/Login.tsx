/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import * as Yup from 'yup'
import clsx from 'clsx'
import { useFormik } from 'formik'
import { actionLogin } from '../../../store/auth/AuthSlice'
import { AuthService } from '../../../services/Auth.service'
import { encryptData } from '../../../helpers/encrypt'
import { AnalyticsService } from '../../../helpers/analytics'

const loginSchema = Yup.object().shape({
   usuario: Yup.string().min(3, 'Mínino 3 caracteres').max(50, 'Máximo 50 caracteres').required('Usuario es requerido'),
   password: Yup.string()
      .min(3, 'Mínino 3 caracteres')
      .max(50, 'Máximo 50 caracteres')
      .required('Contraseña es requerido'),
})

const initialValues = {
   usuario: '',
   password: '',
}

export function Login() {
   const [loading, setLoading] = useState(false)
   const dispatch = useDispatch()

   const formik = useFormik({
      initialValues,
      validationSchema: loginSchema,
      onSubmit: async (values, { setStatus, setSubmitting }) => {
         if (!USERS_DEV.includes(values.usuario) && process.env.REACT_APP_ENV === 'DEV') {
            setStatus('NO POSEE PERMISOS PARA USAR ESTE AMBIENTE')
            return;
         }
         setLoading(true)
         try {
            const result = await AuthService.Newlogin({
               usuario: values.usuario,
               clave: encryptData(values.password)
            })
            if(result.status === "Correcto"){
               setLoading(false)
               dispatch(actionLogin(result))
               setTimeout(() => {
                  AnalyticsService.setUserId(values.usuario)
               }, 100)
            }else{
               setStatus('Credenciales de usuario no son válidas')
               setLoading(false)
               setSubmitting(false)
            }
         } catch (error) {
            setLoading(false)
            setSubmitting(false)
            setStatus('Credenciales de usuario no son válidas')
         }
      },
   })

   return (
      <>
         <form className='form w-100' onSubmit={formik.handleSubmit} noValidate id='kt_login_signin_form'>
            {/* begin::Heading */}
            <div className='text-center mb-10'>
               <h1 className='text-dark mb-3'>Inicio de sesión</h1>
            </div>

            {formik.status && (
               <div className='mb-lg-8 alert alert-danger'>
                  <div className='alert-text font-weight-bold'>{formik.status}</div>
               </div>
            )}

            {/* begin::Form group */}
            <div className='fv-row mb-10'>
               <label className='form-label fs-6 fw-bolder text-dark'>Usuario</label>
               <input
                  placeholder='Usuario'
                  {...formik.getFieldProps('usuario')}
                  className={clsx(
                     'form-control form-control-lg form-control-solid',
                     { 'is-invalid': formik.touched.usuario && formik.errors.usuario },
                     {
                        'is-valid': formik.touched.usuario && !formik.errors.usuario,
                     }
                  )}
                  type='text'
                  name='usuario'
                  autoComplete='off'
               />
               {formik.touched.usuario && formik.errors.usuario && (
                  <div className='fv-plugins-message-container'>
                     <span role='alert'>{formik.errors.usuario}</span>
                  </div>
               )}
            </div>
            {/* end::Form group */}

            {/* begin::Form group */}
            <div className='fv-row mb-10'>
               <div className='d-flex justify-content-between mt-n5'>
                  <div className='d-flex flex-stack mb-2'>
                     {/* begin::Label */}
                     <label className='form-label fw-bolder text-dark fs-6 mb-0'>Contraseña</label>
                     {/* end::Label */}
                  </div>
               </div>
               <input
                  type='password'
                  autoComplete='off'
                  {...formik.getFieldProps('password')}
                  className={clsx(
                     'form-control form-control-lg form-control-solid',
                     {
                        'is-invalid': formik.touched.password && formik.errors.password,
                     },
                     {
                        'is-valid': formik.touched.password && !formik.errors.password,
                     }
                  )}
               />
               {formik.touched.password && formik.errors.password && (
                  <div className='fv-plugins-message-container'>
                     <div className='fv-help-block'>
                        <span role='alert'>{formik.errors.password}</span>
                     </div>
                  </div>
               )}
            </div>
            {/* end::Form group */}

            {/* begin::Action */}
            <div className='text-center'>
               <button
                  type='submit'
                  id='kt_sign_in_submit'
                  className='btn btn-lg btn-primary w-100 mb-5'
                  disabled={formik.isSubmitting || !formik.isValid}
               >
                  {!loading && <span className='indicator-label'>Continuar</span>}
                  {loading && (
                     <span className='indicator-progress' style={{ display: 'block' }}>
                        Procesando ...
                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                     </span>
                  )}
               </button>
            </div>
            {/* end::Action */}
         </form>
      </>
   )
}

const USERS_DEV = ['gpichihua','psandovals', 'mquispem', 'emotta', 
   'nlozano', 'tpuelles', 'jlescano', 'jboulangger', 'rcuadros', 'mcamachoc', 'hllamoca','jchapilliquen',
   'deustaquio', 'darteagae', 'ecancho', 'jdramirezr', 'vzegarra', 'pzumaeta', 'gcandia', 'abarahona',
'jmarcalaya', 'aguerrerog', 'acaceresa', 'jcamposv', 'gtaipe', 'mmotta', 'rgarciaa', 'sfernandezr']
