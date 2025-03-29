'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';
import styles from './projects.module.css';
import withAuth from '../components/withAuth';
import Navbar from '../components/Navbar';
import { projects } from '../data/projects';

function Projects() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('images');

  // Filter projects based on search term
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    // Wait for animation to complete before clearing selected project
    setTimeout(() => {
      setSelectedProject(null);
    }, 300);
  };

  // Close detail panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectedProject && !event.target.closest(`.${styles.projectDetail}`)) {
        handleCloseDetail();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedProject]);

  return (
    <div className={styles.container}>
      <Navbar title="Project Management" />

      <div className={styles.content}>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.projectsGrid}>
          {filteredProjects.map(project => (
            <div
              key={project.id}
              className={styles.projectCard}
              onClick={() => handleProjectClick(project)}
            >
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <p className={styles.location}>
                <strong>Location:</strong> {project.location}
              </p>
              <div className={styles.projectStatus}>
                <span className={styles[project.status.toLowerCase()]}>
                  {project.status}
                </span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progress}
                  style={{ width: `${project.completion}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {selectedProject && (
          <>
            <div 
              className={`${styles.overlay} ${isDetailOpen ? styles.open : ''}`}
              onClick={handleCloseDetail}
            />
            <div className={`${styles.projectDetail} ${isDetailOpen ? styles.open : ''}`}>
              <div className={styles.detailHeader}>
                <h2>{selectedProject.name}</h2>
                <button onClick={handleCloseDetail}>×</button>
              </div>
              
              <div className={styles.detailInfo}>
                <div className={styles.infoSection}>
                  <h3>Description</h3>
                  <p>{selectedProject.description}</p>
                </div>

                <div className={styles.infoSection}>
                  <h3>Location</h3>
                  <p>{selectedProject.location}</p>
                </div>

                <div className={styles.infoSection}>
                  <h3>Status</h3>
                  <span className={styles[selectedProject.status.toLowerCase()]}>
                    {selectedProject.status}
                  </span>
                </div>

                <div className={styles.infoSection}>
                  <h3>Progress</h3>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progress}
                      style={{ width: `${selectedProject.completion}%` }}
                    />
                  </div>
                  <span className={styles.progressText}>{selectedProject.completion}% Complete</span>
                </div>
              </div>

              <div className={styles.detailTabs}>
                <button
                  className={activeSection === 'images' ? styles.active : ''}
                  onClick={() => setActiveSection('images')}
                >
                  Images
                </button>
                <button
                  className={activeSection === 'videos' ? styles.active : ''}
                  onClick={() => setActiveSection('videos')}
                >
                  Videos
                </button>
              </div>

              <div className={styles.detailContent}>
                {activeSection === 'images' && (
                  <div className={styles.imagesGrid}>
                    {selectedProject.images.map((image, index) => (
                      <div key={index} className={styles.imageContainer}>
                        <img src={image} alt={`Project image ${index + 1}`} />
                      </div>
                    ))}
                  </div>
                )}

                {activeSection === 'videos' && (
                  <div className={styles.videosGrid}>
                    {selectedProject.videos.map((video, index) => (
                      <div key={index} className={styles.videoContainer}>
                        <video controls>
                          <source src={video} />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default withAuth(Projects); 