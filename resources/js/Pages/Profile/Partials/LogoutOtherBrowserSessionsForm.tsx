import { useForm } from '@inertiajs/react';
import classNames from 'classnames';
import React, { useRef, useState } from 'react';
import useRoute from '@/Hooks/useRoute';
import ActionMessage from '@/Components/ActionMessage';
import ActionSection from '@/Components/ActionSection';
import DialogModal from '@/Components/DialogModal';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import SecondaryButton from '@/Components/SecondaryButton';
import { Session } from '@/types';

interface Props {
  sessions: Session[];
}

export default function LogoutOtherBrowserSessions({ sessions }: Props) {
  const [confirmingLogout, setConfirmingLogout] = useState(false);
  const route = useRoute();
  const passwordRef = useRef<HTMLInputElement>(null);
  const form = useForm({
    password: '',
  });

  function confirmLogout() {
    setConfirmingLogout(true);

    setTimeout(() => passwordRef.current?.focus(), 250);
  }

  function logoutOtherBrowserSessions() {
    form.delete(route('other-browser-sessions.destroy'), {
      preserveScroll: true,
      onSuccess: () => closeModal(),
      onError: () => passwordRef.current?.focus(),
      onFinish: () => form.reset(),
    });
  }

  function closeModal() {
    setConfirmingLogout(false);

    form.reset();
  }

  return (
    <ActionSection
      title={'Sesiones del navegador'}
      description={
        'Administre y cierre sesión en sus sesiones activas en otros navegadores y dispositivos.'
      }
    >
      <div className="max-w-xl text-sm text-gray-600 dark:text-gray-400">
        Si es necesario, puede cerrar sesión en todas sus demás sesiones de navegador en todos sus dispositivos. 
        A continuación, se enumeran algunas de sus sesiones recientes; sin embargo, esta lista puede no ser exhaustiva. 
        Si cree que su cuenta ha sido vulnerada, también debería actualizar su contraseña.
      </div>

      {/* <!-- Other Browser Sessions --> */}
      {sessions.length > 0 ? (
        <div className="mt-5 space-y-6">
          {sessions.map((session, i) => (
            <div className="flex items-center" key={i}>
              <div>
                {session.agent.is_desktop ? (
                  <svg
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-8 h-8 text-gray-500"
                  >
                    <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-8 h-8 text-gray-500"
                  >
                    <path d="M0 0h24v24H0z" stroke="none"></path>
                    <rect x="7" y="4" width="10" height="16" rx="1"></rect>
                    <path d="M11 5h2M12 17v.01"></path>
                  </svg>
                )}
              </div>

              <div className="ml-3">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {session.agent.platform} - {session.agent.browser}
                </div>

                <div>
                  <div className="text-xs text-gray-500">
                    {session.ip_address},
                    {session.is_current_device ? (
                      <span className="text-green-500 font-semibold">
                        Este dispositivo
                      </span>
                    ) : (
                      <span>Last active {session.last_active}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <div className="flex items-center mt-5">
        <PrimaryButton onClick={confirmLogout}>
          Cerrar sesión en otras sesiones del navegador
        </PrimaryButton>

        <ActionMessage on={form.recentlySuccessful} className="ml-3">
          Done.
        </ActionMessage>
      </div>

      {/* <!-- Log Out Other Devices Confirmation Modal --> */}
      <DialogModal isOpen={confirmingLogout} onClose={closeModal}>
        <DialogModal.Content title={'Cerrar sesión en otras sesiones del navegador'}>
          Ingrese su contraseña para confirmar que desea cerrar sesión 
          en sus otros navegadores en todos sus dispositivos.
          <div className="mt-4">
            <TextInput
              type="password"
              className="mt-1 block w-3/4"
              placeholder="Contraseña"
              ref={passwordRef}
              value={form.data.password}
              onChange={e => form.setData('password', e.currentTarget.value)}
            />

            <InputError message={form.errors.password} className="mt-2" />
          </div>
        </DialogModal.Content>

        <DialogModal.Footer>
          <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>

          <PrimaryButton
            onClick={logoutOtherBrowserSessions}
            className={classNames('ml-2', { 'opacity-25': form.processing })}
            disabled={form.processing}
          >
            Cerrar sesión en otras sesiones del navegador
          </PrimaryButton>
        </DialogModal.Footer>
      </DialogModal>
    </ActionSection>
  );
}
