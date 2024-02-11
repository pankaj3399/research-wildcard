import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const TitleAbstract = () => {
  const [articles, setArticles] = useState([]);
  const { projectId } = useParams();
  

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const result = await axios(`http://localhost:3000/api/projects/${projectId}/articles`);
        console.log(result.data); // Check the structure of the response data
        setArticles(Array.isArray(result.data) ? result.data : []);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
        setArticles([]);
      }
    };
    fetchArticles();
  }, [projectId]);
  
  useEffect(() => {
    console.log(articles); // Log articles after setting them
  }, [articles]);
  

  const handleScreen = async (articleId, screeningStatus) => {
    await axios.patch(`http://localhost:3000/api/articles/${articleId}/screen`, { screeningStatus });
    setArticles(articles && articles.map(article => article._id === articleId ? { ...article, screeningStatus, needsThirdPartyReview: screeningStatus === 'maybe' } : article));
  };

  return (
    <div>
      {Array.isArray(articles) && articles.map(article => (
        <div key={article._id}>
          <h3>{article.title}</h3>
          <p>{article.abstract}</p>
          <button onClick={() => handleScreen(article._id, 'included')}>Include</button>
          <button onClick={() => handleScreen(article._id, 'excluded')}>Exclude</button>
          <button onClick={() => handleScreen(article._id, 'maybe')}>Maybe</button>
          {article.needsThirdPartyReview && <span> (Review Pending)</span>}
        </div>
      ))}
    </div>
  );
  
};

export default TitleAbstract;


