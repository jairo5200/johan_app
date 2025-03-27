import { router } from '@inertiajs/core';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import classNames from 'classnames';
import React, { useState } from 'react';
import ActionSection from '@/Components/ActionSection';
import ConfirmsPassword from '@/Components/ConfirmsPassword';
import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import useTypedPage from '@/Hooks/useTypedPage';

interface Props {
  requiresConfirmation: boolean;
}

export default function TwoFactorAuthenticationForm({
  requiresConfirmation,
}: Props) {
  const page = useTypedPage();
  const [enabling, setEnabling] = useState(false);
  const [disabling, setDisabling] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [confirming, setConfirming] = useState(false);
  const [setupKey, setSetupKey] = useState<string | null>(null);
  const confirmationForm = useForm({
    code: '',
  });
  const twoFactorEnabled =
    !enabling && page.props?.auth?.user?.two_factor_enabled;

  function enableTwoFactorAuthentication() {
    setEnabling(true);

    router.post(
      '/user/two-factor-authentication',
      {},
      {
        preserveScroll: true,
        onSuccess() {
          return Promise.all([
            showQrCode(),
            showSetupKey(),
            showRecoveryCodes(),
          ]);
        },
        onFinish() {
          setEnabling(false);
          setConfirming(requiresConfirmation);
        },
      },
    );
  }

  function showSetupKey() {
    return axios.get('/user/two-factor-secret-key').then(response => {
      setSetupKey(response.data.secretKey);
    });
  }

  function confirmTwoFactorAuthentication() {
    confirmationForm.post('/user/confirmed-two-factor-authentication', {
      preserveScroll: true,
      preserveState: true,
      errorBag: 'confirmTwoFactorAuthentication',
      onSuccess: () => {
        setConfirming(false);
        setQrCode(null);
        setSetupKey(null);
      },
    });
  }

  function showQrCode() {
    return axios.get('/user/two-factor-qr-code').then(response => {
      setQrCode(response.data.svg);
    });
  }

  function showRecoveryCodes() {
    return axios.get('/user/two-factor-recovery-codes').then(response => {
      setRecoveryCodes(response.data);
    });
  }

  function regenerateRecoveryCodes() {
    axios.post('/user/two-factor-recovery-codes').then(() => {
      showRecoveryCodes();
    });
  }

  function disableTwoFactorAuthentication() {
    setDisabling(true);

    router.delete('/user/two-factor-authentication', {
      preserveScroll: true,
      onSuccess() {
        setDisabling(false);
        setConfirming(false);
      },
    });
  }

  return (
    <ActionSection
      title={'Autenticación de Dos Factores'}
      description={
        'Agregue seguridad adicional a su cuenta utilizando la autenticación de dos factores.'
      }
    >
      {(() => {
        if (twoFactorEnabled && !confirming) {
          return (
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Ha habilitado la autenticación de dos factores.
            </h3>
          );
        }
        if (confirming) {
          return (
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Terminar de habilitar la autenticación de dos factores.
            </h3>
          );
        }
        return (
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            No ha habilitado la autenticación de dos factores.
          </h3>
        );
      })()}

      <div className="mt-3 max-w-xl text-sm text-gray-600 dark:text-gray-400">
        <p>
          Cuando la autenticación de dos factores esté habilitada, 
          se te solicitará un token aleatorio y seguro durante la autenticación. 
          Puedes obtener este token desde la aplicación Google Authenticator de tu teléfono.
        </p>
      </div>

      {twoFactorEnabled || confirming ? (
        <div>
          {qrCode ? (
            <div>
              <div className="mt-4 max-w-xl text-sm text-gray-600 dark:text-gray-400">
                {confirming ? (
                  <p className="font-semibold">
                    Para finalizar la activación de la autenticación de dos factores, 
                    escanee el siguiente código QR con la aplicación de autenticación de su teléfono 
                    o ingrese la clave de configuración y proporcione el código OTP generado.
                  </p>
                ) : (
                  <p>
                    La autenticación de dos factores ya está habilitada. 
                    Escanea el siguiente código QR con la aplicación de autenticación 
                    de tu teléfono o introduce la clave de configuración.
                  </p>
                )}
              </div>

              <div
                className="mt-4"
                dangerouslySetInnerHTML={{ __html: qrCode || '' }}
              />

              {setupKey && (
                <div className="mt-4 max-w-xl text-sm text-gray-600 dark:text-gray-400">
                  <p className="font-semibold">
                    Setup Key:{' '}
                    <span
                      dangerouslySetInnerHTML={{ __html: setupKey || '' }}
                    />
                  </p>
                </div>
              )}

              {confirming && (
                <div className="mt-4">
                  <InputLabel htmlFor="code" value="Code" />

                  <TextInput
                    id="code"
                    type="text"
                    name="code"
                    className="block mt-1 w-1/2"
                    inputMode="numeric"
                    autoFocus={true}
                    autoComplete="one-time-code"
                    value={confirmationForm.data.code}
                    onChange={e =>
                      confirmationForm.setData('code', e.currentTarget.value)
                    }
                  />

                  <InputError
                    message={confirmationForm.errors.code}
                    className="mt-2"
                  />
                </div>
              )}
            </div>
          ) : null}

          {recoveryCodes.length > 0 && !confirming ? (
            <div>
              <div className="mt-4 max-w-xl text-sm text-gray-600 dark:text-gray-400">
                <p className="font-semibold">
                  Guarda estos códigos de recuperación en un gestor de contraseñas seguro. 
                  Pueden usarse para recuperar el acceso a tu cuenta si pierdes 
                  tu dispositivo de autenticación de dos factores.
                </p>
              </div>

              <div className="grid gap-1 max-w-xl mt-4 px-4 py-4 font-mono text-sm bg-gray-100 dark:bg-gray-900 rounded-lg">
                {recoveryCodes.map(code => (
                  <div key={code}>{code}</div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="mt-5">
        {twoFactorEnabled || confirming ? (
          <div>
            {confirming ? (
              <ConfirmsPassword onConfirm={confirmTwoFactorAuthentication}>
                <PrimaryButton
                  className={classNames('mr-3', { 'opacity-25': enabling })}
                  disabled={enabling}
                >
                  Confirmar
                </PrimaryButton>
              </ConfirmsPassword>
            ) : null}
            {recoveryCodes.length > 0 && !confirming ? (
              <ConfirmsPassword onConfirm={regenerateRecoveryCodes}>
                <SecondaryButton className="mr-3">
                  Regenerar códigos de recuperación
                </SecondaryButton>
              </ConfirmsPassword>
            ) : null}
            {recoveryCodes.length === 0 && !confirming ? (
              <ConfirmsPassword onConfirm={showRecoveryCodes}>
                <SecondaryButton className="mr-3">
                  Mostrar códigos de recuperación
                </SecondaryButton>
              </ConfirmsPassword>
            ) : null}

            {confirming ? (
              <ConfirmsPassword onConfirm={disableTwoFactorAuthentication}>
                <SecondaryButton
                  className={classNames('mr-3', { 'opacity-25': disabling })}
                  disabled={disabling}
                >
                  Cancelar
                </SecondaryButton>
              </ConfirmsPassword>
            ) : (
              <ConfirmsPassword onConfirm={disableTwoFactorAuthentication}>
                <DangerButton
                  className={classNames({ 'opacity-25': disabling })}
                  disabled={disabling}
                >
                  Desactivar
                </DangerButton>
              </ConfirmsPassword>
            )}
          </div>
        ) : (
          <div>
            <ConfirmsPassword onConfirm={enableTwoFactorAuthentication}>
              <PrimaryButton
                type="button"
                className={classNames({ 'opacity-25': enabling })}
                disabled={enabling}
              >
                Activar
              </PrimaryButton>
            </ConfirmsPassword>
          </div>
        )}
      </div>
    </ActionSection>
  );
}
