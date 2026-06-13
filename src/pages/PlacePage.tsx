import { Suspense, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import FablePanel from '../components/ui/FablePanel';
import SceneControls from '../components/ui/SceneControls';
import LoadingScreen from '../components/ui/LoadingScreen';
import WebGLFallback from '../components/ui/WebGLFallback';
import CanvasBoundary from '../components/CanvasBoundary';
import NotFoundPage from './NotFoundPage';
import { getPlace } from '../data/places';
import { getScene } from '../data/sceneRegistry';
import { useSceneStore } from '../store/useSceneStore';
import { isWebGLAvailable } from '../lib/webgl';

export default function PlacePage() {
  const { id = '' } = useParams();
  const place = getPlace(id);
  const Scene = getScene(id);

  // Reset interaction state whenever the active place changes.
  useEffect(() => {
    useSceneStore.getState().reset();
  }, [id]);

  if (!place || !Scene) return <NotFoundPage />;

  const webgl = isWebGLAvailable();

  return (
    <main className="relative h-[100svh] w-full overflow-hidden">
      <Navbar variant="place" />

      {/* 3D stage */}
      <div className="absolute inset-0">
        {webgl ? (
          <CanvasBoundary fallback={<WebGLFallback place={place} />}>
            <Suspense fallback={<LoadingScreen label={`Summoning ${place.name}`} />}>
              <Scene />
            </Suspense>
          </CanvasBoundary>
        ) : (
          <WebGLFallback place={place} />
        )}
      </div>

      {/* Overlays */}
      {webgl && <SceneControls placeId={place.id} />}
      <FablePanel place={place} />
    </main>
  );
}
