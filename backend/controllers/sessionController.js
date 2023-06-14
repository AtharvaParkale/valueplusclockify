import Session from "../models/sessionModel.js";
import ErrorHandler from "../utils/errorHandler.js";

// CREATE SESSION
export const createSession = async (req, res, next) => {
  try {
    const newSession = new Session(req.body);
    const session = await newSession.save();

    const sessions = await Session.find().sort({ createdAt: -1 });

    const aggregationPipeline = [
      {
        $group: {
          _id: "$date",
          data: { $push: "$$ROOT" },
          grandTotal: { $sum: "$grandTotal" }
        }
      },
      {
        $sort: { createdAt: -1 } 
      }
    ];

    const groupedData = await Session.aggregate(aggregationPipeline);
    const gt = await Session.aggregate([
      {
        $group: {
          _id: null,
          totalPoints: {
            $sum: "$grandTotal",
          },
          
        },
        
      },
    ]);

    const sumOfTime = gt[0].totalPoints;
    res.status(200).json({
      sessions,
      sumOfTime,
      groupedData
    });
  } catch (err) {
    next(err);
  }
};

// Get All Session
export const getAllSessions = async (req, res, next) => {
  try {
    const sessions = await Session.find()

    //This function will group the data based on time

    const aggregationPipeline = [
      {
        $group: {
          _id: "$date",
          data: { $push: "$$ROOT" },
          grandTotal: { $sum: "$grandTotal" }
        }
      },
      {
        $sort: { createdAt: -1 } 
      }
    ];

    const groupedData = await Session.aggregate(aggregationPipeline).sort({ createdAt: 1 });

    if (sessions.length != 0) {
      const gt = await Session.aggregate([
        {
          $group: {
            _id: null,
            totalPoints: {
              $sum: "$grandTotal",
            },
          },
        },
      ]);

      const sumOfTime = gt[0].totalPoints;

      res.status(200).json({
        success: true,
        sessions,
        sumOfTime,
        groupedData
      });

    } else {
      res.status(200).json({
        success: true,
        sessions,
        sumOfTime:0,
        groupedData
      });
    }
  } catch (err) {
    next(err);
  }
};

//UPDATE SESSION
export const updateSession = async (req, res, next) => {
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
    const sessions = await Session.find().sort({ createdAt: -1 });
    const aggregationPipeline = [
      {
        $group: {
          _id: "$date",
          data: { $push: "$$ROOT" },
          grandTotal: { $sum: "$grandTotal" }
        }
      },
      {
        $sort: { createdAt: -1 } 
      }
    ];

    const groupedData = await Session.aggregate(aggregationPipeline);

    if (sessions.length != 0) {
      const gt = await Session.aggregate([
        {
          $group: {
            _id: null,
            totalPoints: {
              $sum: "$grandTotal",
            },
          },
        },
      ]);

      const sumOfTime = gt[0].totalPoints;

      res.status(200).json({
        sessions,
        sumOfTime,
        groupedData 
      });
    } else {
      res.status(200).json({
        sessions,
        sumOfTime: 0,
        groupedData 
      });
    }
  } catch (err) {
    next(err);
  }
};
