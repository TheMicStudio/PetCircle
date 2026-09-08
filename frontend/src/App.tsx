import {Route, Routes} from 'react-router-dom';
import {Button} from '@astryxdesign/core/Button';

function HomePage() {
  return (
    <main className="page">
      <h1>PetCircle</h1>
      <p>Le setup est en place. Les pages arrivent avec les stories S1 à S8.</p>
      <Button label="Astryx est branché" variant="primary" />
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}
