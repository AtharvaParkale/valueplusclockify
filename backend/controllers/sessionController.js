import Session from "../models/sessionModel.js";
import ErrorHandler from "../utils/errorHandler.js";

// CREATE SESSION
export const createSession = async (req, res, next) => {
  try {

    const newSession = new Session(req.body);
    const session = await newSession.save();

    const sessions = await Session.find();
    res.status(200).json(sessions);
    
  } catch (err) {
    next(err);
  }
};

// Get All Session
export const getAllSessions = async (req, res, next) => {
  try {
    const sessions = await Session.find();
    res.status(200).json({
      success: true,
      sessions,
    });
  } catch (err) {
    next(err);
  }
};

//UPDATE SESSION
export const updateSession = async (req, res,next) => {
  try {
    let session = await Session.findById(req.params.id);

    if (!session) {
      return next(new ErrorHandler("Session not found !", 404));
    }

    session = await Session.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
      session,
    });
  } catch (err) {
    next(err);
  }
};

//DELETE SESSION
export const deleteSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return next(new ErrorHandler("Session not found !", 404));
    }

    await session.deleteOne();
    res.status(200).json({
      success: true,
      message: "Session deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
