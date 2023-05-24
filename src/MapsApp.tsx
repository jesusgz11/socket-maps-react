import SocketProvider from './contexts/SocketProvider';
import MapPage from './pages/MapPage';

const MapsApp = () => {
  return (
    <SocketProvider>
      <MapPage />
    </SocketProvider>
  );
};

export default MapsApp;
