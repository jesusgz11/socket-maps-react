import { useEffect } from 'react';
import { NewMarker, useMapbox } from '../hooks/useMapbox';
import { useSocketContext } from '../hooks/useSocketContext';

const MapPage = () => {
  const {
    newMarker$,
    setRefNode,
    moveMarker$,
    addMarker,
    updatePositionMarker,
  } = useMapbox();
  const { socket } = useSocketContext();

  useEffect(() => {
    socket.on('active-markers', (markers: Record<string, NewMarker>) => {
      for (const key of Object.keys(markers)) {
        addMarker(markers[key]);
      }
    });
    return () => {
      socket.off('active-markers');
    };
  }, [socket, addMarker]);

  useEffect(() => {
    const subscriptionNewMarker = newMarker$.subscribe((marker) => {
      socket.emit('new-marker', marker);
    });
    return () => {
      subscriptionNewMarker.unsubscribe();
    };
  }, [newMarker$, socket]);

  useEffect(() => {
    const subscriptionMoveMarker = moveMarker$.subscribe((marker) => {
      socket.emit('update-marker', marker);
    });
    return () => {
      subscriptionMoveMarker.unsubscribe();
    };
  }, [socket, moveMarker$]);

  useEffect(() => {
    socket.on('new-marker', (marker: NewMarker) => {
      addMarker(marker);
    });
    return () => {
      socket.off('new-marker');
    };
  }, [socket, addMarker]);

  useEffect(() => {
    socket.on('update-marker', updatePositionMarker);
    return () => {
      socket.off('update-marker');
    };
  }, [socket, updatePositionMarker]);

  return (
    <>
      <div ref={setRefNode} className="map-container" />
    </>
  );
};

export default MapPage;
