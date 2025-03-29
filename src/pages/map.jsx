'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';
import styles from './map.module.css';
import withAuth from '../components/withAuth';
import Navbar from '../components/Navbar';
import { projects } from '../data/projects';

function Map() {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initMap = async () => {
      try {
        const { Map, View } = await import('ol');
        const { Tile: TileLayer } = await import('ol/layer');
        const { OSM } = await import('ol/source');
        const { fromLonLat } = await import('ol/proj');
        const { Feature } = await import('ol');
        const { Point } = await import('ol/geom');
        const { Vector: VectorLayer } = await import('ol/layer');
        const { Vector: VectorSource } = await import('ol/source');
        const { Style, Icon, Text, Fill, Stroke } = await import('ol/style');

        // Create map instance
        const mapInstance = new Map({
          target: mapRef.current,
          layers: [new TileLayer({ source: new OSM() })],
          view: new View({
            center: fromLonLat([0, 0]), // Center on prime meridian
            zoom: 2 // Show the whole world
          })
        });

        setMap(mapInstance);

        // Create vector layer for markers
        const vectorSource = new VectorSource();
        const vectorLayer = new VectorLayer({
          source: vectorSource
        });
        mapInstance.addLayer(vectorLayer);

        // Add click handler for markers
        mapInstance.on('click', (event) => {
          mapInstance.forEachFeatureAtPixel(event.pixel, (feature) => {
            const project = feature.get('project');
            if (project) {
              setSelectedProject(project);
              return true;
            }
          });
        });

        // Geocode and add markers for each project
        const newMarkers = [];
        for (const project of projects) {
          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_NOMINATIM_API_URL}/search?format=json&q=${encodeURIComponent(project.location)}`
            );
            const data = await response.json();
            
            if (data && data[0]) {
              const coordinates = fromLonLat([parseFloat(data[0].lon), parseFloat(data[0].lat)]);
              
              // Create marker feature
              const feature = new Feature({
                geometry: new Point(coordinates),
                project: project
              });

              // Create marker style with text label
              feature.setStyle(new Style({
                image: new Icon({
                  src: 'https://openlayers.org/en/latest/examples/data/icon.png',
                  scale: 0.5,
                  anchor: [0.5, 1]
                }),
                text: new Text({
                  text: project.location.split(',')[0], // Show only city name
                  offsetY: -20,
                  fill: new Fill({ color: '#000' }),
                  stroke: new Stroke({ color: '#fff', width: 3 })
                })
              }));

              vectorSource.addFeature(feature);
              newMarkers.push(feature);
            }
          } catch (error) {
            console.error(`Error geocoding ${project.location}:`, error);
          }
        }

        setMarkers(newMarkers);
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing map:', error);
        setIsLoading(false);
      }
    };

    initMap();

    return () => {
      if (map) {
        map.setTarget(null);
      }
    };
  }, []);

  return (
    <div className={styles.container}>
      <Navbar title="Project Locations" />
      
      <div className={styles.mapContainer} ref={mapRef}>
        {isLoading && (
          <div className={styles.loading}>
            Loading map...
          </div>
        )}
      </div>

      {selectedProject && (
        <div className={styles.projectInfo}>
          <div className={styles.infoHeader}>
            <h2>{selectedProject.name}</h2>
            <button onClick={() => setSelectedProject(null)}>×</button>
          </div>
          <p>{selectedProject.description}</p>
          <div className={styles.projectStatus}>
            <span className={styles[selectedProject.status.toLowerCase()]}>
              {selectedProject.status}
            </span>
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progress}
              style={{ width: `${selectedProject.completion}%` }}
            />
          </div>
          <p className={styles.location}>
            <strong>Location:</strong> {selectedProject.location}
          </p>
        </div>
      )}
    </div>
  );
}

export default withAuth(Map); 