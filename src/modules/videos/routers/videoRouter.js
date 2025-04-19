const { Router } = require("express");
const { getAllVideos,createVideo,getVideoById,updateVideo,deleteVideo } = require("../controllers/videoController");

const videoRouter = Router();

//videoRouter.get("/videos", (req, res) =>{
//    res.status(200).json(videos);
//});

videoRouter.route("/").get(getAllVideos).post(createVideo);

videoRouter.route("/:id").get(getVideoById).patch(updateVideo).delete(deleteVideo);

module.exports = videoRouter;