import { useNavigate } from 'react-router-dom'
import { Paw } from '../assets/svg/Paw'
import { SoundButton } from './SoundButton'

/** Always-visible, always-same-spot way back to the hub from inside any game. */
export function HomeButton() {
  const navigate = useNavigate()
  return (
    <div className="fixed left-4 top-4 z-40">
      <SoundButton ariaLabel="Home" sound="tap" onClick={() => navigate('/')} className="bg-white/90 p-3">
        <Paw className="h-10 w-10" />
      </SoundButton>
    </div>
  )
}
