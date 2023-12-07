import { useState } from 'react'
import { ViewType } from '@supabase/auth-ui-shared'
import { Auth } from 'components'
import { useAppContext } from 'contexts'

const views: { id: ViewType; title: string }[] = [
  { id: 'sign_in', title: 'Sign In' },
  { id: 'sign_up', title: 'Sign Up' },
  { id: 'magic_link', title: 'Magic Link' },
  { id: 'forgotten_password', title: 'Forgotten Password' },
  { id: 'update_password', title: 'Update Password' },
  { id: 'verify_otp', title: 'Verify Otp' },
]

export const ExampleApp = () => {
  const [view, setView] = useState(views[0])
  const { supabase } = useAppContext()

  return (
    <div className="relative flex flex-col gap-8 items-center w-full pt-8">
      <div className="relative lg:mx-auto w-96 border-[1px] border-slate-300 rounded-lg shadow-lg px-8 py-12">
        <div className="mb-6 flex flex-col gap-3">
          <h1 className="text-scale-1200 text-2xl">
            Acme Industries
          </h1>
          <p className="text-scale-1100 text-auth-widget-test">
            Sign in today for Supa stuff
          </p>
        </div>
        <Auth
          supabaseClient={supabase}
          view={view.id}
          providers={['apple', 'google', 'github', 'facebook', 'azure', 'discord', 'gitlab']}
          socialLayout="vertical"
        />
      </div>

      <div className="flex flex-col items-center gap-4 border-[1px] border-slate-300 rounded-lg shadow-lg p-8 w-96 mb-6">
        <div className="text-scale-1200 text-base font-semibold">Component View</div>
        <select
          value={views.indexOf(view)}
          onChange={(e) => setView(views[Number(e.target.value)])}
          className="text-lg rounded border-2 border-blue-700 text-gray-600 pl-5 pr-10 h-12 bg-white hover:border-gray-400 appearance-none w-max text-center"
        >
          {views.map((v, i) => <option key={i} value={i}>{v.title}</option>)}
        </select>
      </div>
    </div>
  )
}
