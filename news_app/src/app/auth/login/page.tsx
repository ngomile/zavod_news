import { LoginForm } from "@/app/auth/login/login-form"

import {
  Terminal
} from 'lucide-react';

import {
  Alert,
  AlertDescription,
  AlertTitle
} from '@/components/ui/alert';


export default function Page() {
  const params = new URLSearchParams(window.location.search);
  const error = params.get('error');

  return (
    <>
      { error && (
        <div className="flex flex-row justify-center items-end p-2 w-full">
          <Alert className="max-w-sm">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              { error }
            </AlertDescription>
          </Alert>
        </div>
      )}
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </>
  )
}
