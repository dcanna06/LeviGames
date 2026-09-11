import { Route, Routes } from 'react-router-dom'
import { HubScreen } from './hub/HubScreen'
import { DinoTapGame } from './games/dino-tap/DinoTapGame'
import { PuppyCafeGame } from './games/puppy-cafe/PuppyCafeGame'
import { CountingDinosGame } from './games/counting-dinos/CountingDinosGame'
import { MemoryMatchGame } from './games/memory-match/MemoryMatchGame'
import { AnimalSoundsGame } from './games/animal-sounds/AnimalSoundsGame'
import { FixItGarageGame } from './games/fix-it-garage/FixItGarageGame'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HubScreen />} />
      <Route path="/dino-tap" element={<DinoTapGame />} />
      <Route path="/puppy-cafe" element={<PuppyCafeGame />} />
      <Route path="/counting-dinos" element={<CountingDinosGame />} />
      <Route path="/memory-match" element={<MemoryMatchGame />} />
      <Route path="/animal-sounds" element={<AnimalSoundsGame />} />
      <Route path="/fix-it-garage" element={<FixItGarageGame />} />
    </Routes>
  )
}
