

const Study = require('../models/Article'); // Ensure you import your Study model correctly

exports.updateStudyScreeningStatus = async (req, res) => {
  const { studyId } = req.params;
  const { screeningStatus } = req.body; // 'included', 'excluded', 'maybe', or 'unreviewed'

  try {
    const update = {
      screeningStatus,
      needsThirdPartyReview: screeningStatus === 'maybe'
    };

    const study = await Study.findByIdAndUpdate(studyId, update, { new: true });

    if (!study) {
      return res.status(404).send('Study not found');
    }

    res.json({ message: "Study updated successfully", study });
  } catch (error) {
    res.status(500).json({ message: "Error updating study", error: error.message });
  }
};
