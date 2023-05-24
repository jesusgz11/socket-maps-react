import { useEffect, useRef, useState, RefCallback, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { v4 as uuid } from 'uuid';
import { Subject } from 'rxjs';
import { instanceOfNewMarker } from '../utils/instance-of';

export type NewMarker = {
  id?: string;
  lat: number;
  lng: number;
};

type IdMarker = { id?: string };

type MarkerWithId = mapboxgl.Marker & IdMarker;

type Coords = {
  lat: number;
  lng: number;
  zoom: number;
};

mapboxgl.accessToken =
  'pk.eyJ1IjoiamVzdXNnejExIiwiYSI6ImNsaHRnengxMDE3Zm0zZ281aDR6dHBteWoifQ.9Wu0EQZhzexULXSV0xJKjw';

const INIT_POINT: Coords = {
  lat: 19.432608,
  lng: -99.133209,
  zoom: 6,
};

export const useMapbox = () => {
  const markers = useRef<Record<string, MarkerWithId>>({});
  const mapNodeRef = useRef<HTMLDivElement | null>(null);
  const newMarker = useRef<Subject<NewMarker>>(new Subject());
  const moveMarker = useRef<Subject<NewMarker>>(new Subject());
  const map = useRef<mapboxgl.Map>();
  const [coords, setCoords] = useState<Coords>(INIT_POINT);

  const setRefNode: RefCallback<HTMLDivElement> = useCallback((node) => {
    mapNodeRef.current = node;
  }, []);

  const addMarker = useCallback(
    (ev: (mapboxgl.MapMouseEvent & mapboxgl.EventData) | NewMarker) => {
      if (!map.current) return;
      const { lng, lat } = instanceOfNewMarker(ev) ? ev : ev.lngLat;
      const marker: MarkerWithId = new mapboxgl.Marker();
      marker.id = instanceOfNewMarker(ev) && ev.id ? ev.id : uuid();
      marker.setLngLat([lng, lat]).addTo(map.current).setDraggable(true);
      markers.current[marker.id] = marker;
      if (!ev.id) newMarker.current.next({ id: marker.id, lng, lat });
      marker.on('drag', (event) => {
        if (!event) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { target } = event as any;
        const markerId = target.id as string;
        const coords = target.getLngLat() as { lat: number; lng: number };
        moveMarker.current.next({ id: markerId, ...coords });
      });
    },
    []
  );

  const updatePositionMarker = useCallback((marker: NewMarker) => {
    if (!marker.id) return;
    markers.current[marker.id].setLngLat([marker.lng, marker.lat]);
  }, []);

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapNodeRef.current || '',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [INIT_POINT.lng, INIT_POINT.lat],
      zoom: INIT_POINT.zoom,
    });
  }, []);

  useEffect(() => {
    const onMoveHandler = () => {
      if (!map.current) return;
      const { lat, lng } = map.current.getCenter();
      setCoords({ lat, lng, zoom: map.current.getZoom() });
    };

    map.current?.on('move', onMoveHandler);

    return () => {
      map.current?.off('move', onMoveHandler);
    };
  }, []);

  useEffect(() => {
    map.current?.on('click', addMarker);
    return () => {
      map.current?.off('click', addMarker);
    };
  }, [addMarker]);

  return {
    markers,
    coords,
    newMarker$: newMarker.current,
    moveMarker$: moveMarker.current,
    setRefNode,
    addMarker,
    updatePositionMarker,
  };
};
