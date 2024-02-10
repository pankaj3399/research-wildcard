import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const TitleAbstract = () => {
  const [studies, setStudies] = useState([]);
  const { projectId } = useParams();

  useEffect(() => {
    const fetchStudies = async () => {
      const result = await axios(`http://localhost:3000/api/projects/${projectId}/articles`);
      setStudies(result.data);
    };
    fetchStudies();
  }, [projectId]);

  //route to abstract title screen
  //material UI verticakl list for the right hand side
  //clickOff 
  //change screencingStatsu
  // call api and update the index.
  //on the last index  render completion.
  //store screening status of each each stage of ech article
  //so intotal two screening status per article.
  // duplicate api to fetch articles, creat a map of title and iterate through the articles
  //call api and render through a vertical list.

  const handleScreen = async (studyId, screeningStatus) => {
    await axios.patch(`http://localhost:3000/api/studies/${studyId}/screen`, { screeningStatus });
    setStudies(studies && studies.map(study => study._id === studyId ? { ...study, screeningStatus, needsThirdPartyReview: screeningStatus === 'maybe' } : study));
  };

  return (
    <div>
      {studies.map(study => (
        <div key={study._id}>
          <h3>{study.title}</h3>
          <p>{study.abstract}</p>
          <button onClick={() => handleScreen(study._id, 'included')}>Include</button>
          <button onClick={() => handleScreen(study._id, 'excluded')}>Exclude</button>
          <button onClick={() => handleScreen(study._id, 'maybe')}>Maybe</button>
          {study.needsThirdPartyReview && <span> (Review Pending)</span>}
        </div>
      ))}
    </div>
  );
};

export default TitleAbstract;
