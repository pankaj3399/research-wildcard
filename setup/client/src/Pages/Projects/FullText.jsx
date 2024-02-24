import React, { useEffect, useState } from "react";
import "../../Styles/TitleAbstract.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { pink } from "@mui/material/colors";

const FullText = () => {
  const [articles, setArticles] = useState([]);
  const [totalArticlesCount, setTotalArticlesCount] = useState(0);
  const [viewArticle, setViewArticle] = useState("");
  const { projectId } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchArticles = async () => {
    try {
      const result = await axios(
        `http://localhost:3000/api/projects/${projectId}/articles`
      );
      console.log("Articles Fetched: ", result.data); // Check the structure of the response data
      setTotalArticlesCount(
        Array.isArray(result.data.studies) ? result.data.studies.length : 0
      );
      const includedArticles = result.data.studies.filter(
        (article) => article.titleScreeningStatus === "included"
      );
      console.log("Filtered Articles: ", includedArticles);
      setArticles(Array.isArray(result.data.studies) ? includedArticles : []);
    } catch (error) {
      console.error("Failed to fetch articles:", error);
      setArticles([]);
    }
  };

  const fetchProject = async () => {
    try {
      const result = await axios(
        `http://localhost:3000/api/projects/${projectId}`
      );
      console.log("Project Fetched: ", result.data); // Check the structure of the response data
      setProject(result.data.project);
    } catch (error) {
      console.error("Failed to fetch project", error);
      setProject(null);
    }
  };

  useEffect(() => {
    fetchArticles();
    fetchProject();
  }, [projectId]);

  useEffect(() => {
    console.log(articles); // Log articles after setting them
    if (articles && articles.length > 0) {
      const initialViewArticle = getInitialViewArticle(articles);
      setViewArticle(initialViewArticle);
    }
  }, [articles]);

  const handleScreen = async (articleId, bodyScreeningStatus) => {
    await axios.put(
      `http://localhost:3000/api/articles/${articleId}/body-screen`,
      { bodyScreeningStatus }
    );
    setArticles(
      articles &&
        articles.map((article) =>
          article._id === articleId
            ? {
                ...article,
                bodyScreeningStatus,
                needsThirdPartyReview: bodyScreeningStatus === "maybe",
              }
            : article
        )
    );
  };

  const handleView = (article) => {
    setViewArticle(article);
  };

  const getInitialViewArticle = (articles) => {
    return (
      articles.find(
        (article) => article.bodyScreeningStatus === "unreviewed"
      ) || null
    );
  };

  const getUndecidedArticlesCount = () => {
    let unreviewedCount = 0;

    articles.forEach((article) => {
      if (article.bodyScreeningStatus === "unreviewed") {
        unreviewedCount++;
      }
    });
    return unreviewedCount;
  };
  console.log("Hello");
  return (
    <div className="Articles">
      <div className="header">
        Showing {articles.length} filtered out of {totalArticlesCount} Articles
      </div>
      {articles && articles.length > 0 && (
        <div className="main-body">
          <div className="articles-sidebar">
            <div className="articles-sidebar-header">
              {getUndecidedArticlesCount()} Undecided
            </div>
            <div className="articles-sidebar-content">
              {Array.isArray(articles) &&
                articles.map((article) => (
                  <div key={article._id} className="sidebar-item">
                    <div className="seperator"></div>
                    <div
                      className={`sidebar-item-content ${
                        viewArticle?._id === article._id
                          ? "active-sidebar-item-content"
                          : `non-active-sidebar-item-content ${article.bodyScreeningStatus}-article-item`
                      } `}
                      onClick={() => handleView(article)}
                    >
                      <div className="article-title">{article.title}</div>
                      <div className="article-date">
                        Date:{" "}
                        {new Date(article.publicationDate).toLocaleDateString()}
                      </div>
                      <div
                        className={`article-status ${article.bodyScreeningStatus}-article-status`}
                      >
                        {article.bodyScreeningStatus !== "unreviewed"
                          ? article.bodyScreeningStatus
                          : ""}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          {viewArticle && (
            <div className="article-content">
              <div className="article-content-title">{viewArticle.title}</div>
              <div className="article-content-body">
                <div className="bold">Body:</div>
                <div>{viewArticle.body}</div>
              </div>
              <div className="review-list">
                <p className="review-title">Review Criteria</p>
                <div className="review-list-container">
                  <ul style={{ listStyleType: "none" }}>
                    <lh>
                      {" "}
                      <CheckIcon color="success" />
                      Accept Criteria
                    </lh>
                    {(project?.inclusion || []).map((criteria) => (
                      <li>{criteria}</li>
                    ))}
                  </ul>
                  <ul style={{ listStyleType: "none" }}>
                    <lh>
                      {" "}
                      <CloseIcon sx={{ color: pink[500] }} /> Decline Criteria
                    </lh>
                    {(project?.exclusion || []).map((criteria) => (
                      <li>{criteria}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="footer">
                <div className="btns-div">
                  <button
                    id="btn-1"
                    className="btn"
                    onClick={() => handleScreen(viewArticle._id, "included")}
                  >
                    Include
                  </button>
                  <button
                    id="btn-2"
                    className="btn"
                    onClick={() => handleScreen(viewArticle._id, "maybe")}
                  >
                    Maybe
                  </button>
                  <button
                    id="btn-3"
                    className="btn"
                    onClick={() => handleScreen(viewArticle._id, "excluded")}
                  >
                    Exclude
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FullText;
