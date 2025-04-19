const Videos = require("../../../database/models/videosModel");
const catchAsync = require("../../../utils/catchAsync");

//const getAllVideo = (req, res) =>{
//    res.status(200).json(videos);
//};

//const createVideos = (req, res) =>{
//    res.status(200).json(videos);
//};

const getAllVideos = catchAsync(async (req, res, next) => {
    const videos = await Videos.find();
    res.json(videos);
});

const getVideoById = catchAsync(async (req, res, next) => {
  const videos = await Videos.findOne({ id: req.params.id });
  if (!videos) {
    return next(new AppError("No se encontro el video", 404));
  }
  res.json(videos);
});

const createVideo = catchAsync(async (req, res, next) => {
    const { title } = req.body;
    if (!title) {
      throw new AppError("Se requiere titulo", 400);
    }
    const { description } = req.body;
    if (!description) {
      throw new AppError("Se requiere descripcion", 400);
    }
    const { genre } = req.body;
    if (!genre) {
      throw new AppError("Se requiere genero", 400);
    }
  
    const newVideo = await Videos.create({ title,description,genre });
    res.status(201).json(newVideo);
});

const updateVideo = catchAsync(async (req, res, next) => {
    const video = await Videos.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!video) {
      return next(new AppError("No se encontro el video", 404));
    }
    res.status(200).json(video);
});

const deleteVideo = catchAsync(async (req, res, next) => {
    const video = await Videos.findOneAndDelete({ id: req.params.id });
    if (!video) {
      return next(new AppError("No se encontro el video", 404));
    }
    res.status(204).json({ status: "success" });
});

module.exports = { getAllVideos, createVideo, getVideoById, updateVideo, deleteVideo };