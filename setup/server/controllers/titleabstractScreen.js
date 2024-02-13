const Study = require('../models/Article'); // Ensure you import your Study model correctly

exports.updateTitleStudyScreeningStatus = async (req, res) => {
  const { articleId } = req.params;
  const { titleScreeningStatus } = req.body; // 'included', 'excluded', 'maybe', or 'unreviewed'
  console.log('Hit....', articleId, titleScreeningStatus);
  try {
    const update = {
      titleScreeningStatus,
      needsThirdPartyReview: titleScreeningStatus === 'maybe'
    };

    const study = await Study.findByIdAndUpdate(articleId, update, { new: true });

    if (!study) {
      return res.status(404).send('Study not found');
    }

    res.json({ message: "Study updated successfully", study });
  } catch (error) {
    res.status(500).json({ message: "Error updating study", error: error.message });
  }
};

exports.updateBodyStudyScreeningStatus = async (req, res) => {
  const { articleId } = req.params;
  const { bodyScreeningStatus } = req.body; // 'included', 'excluded', 'maybe', or 'unreviewed'
  console.log('Hit....', articleId, bodyScreeningStatus);
  try {
    const update = {
      bodyScreeningStatus,
      needsThirdPartyReview: bodyScreeningStatus === 'maybe'
    };

    const study = await Study.findByIdAndUpdate(articleId, update, { new: true });

    if (!study) {
      return res.status(404).send('Study not found');
    }

    res.json({ message: "Study updated successfully", study });
  } catch (error) {
    res.status(500).json({ message: "Error updating study", error: error.message });
  }
};

