import Hardware from "../models/hardware";
import HardwareUpdate from "../models/hardware_updates";
import Model from "../models/models";
import Component from "../models/components";
import { Request, Response, NextFunction } from "express";

const add_hardware = async (req: Request, res: Response) => {
  try {
    const {
      hardwareID,
      componentID,
      name,
      type,
      manufacturer,
      manufacture_date,
      modelID,
      installation_date,
      installed_version,
      properties,
    } = req.body;

    // Check if the hardwareID already exists
    const existingHardware = await Hardware.findOne({ hardwareID });
    if (existingHardware) {
      return res.status(400).json({
        success: false,
        message: "hardware already exists",
      });
    }

    // Check if the modelID exists
    const existingModel = await Model.findOne({ modelID });
    if (!existingModel) {
      return res.status(400).json({
        success: false,
        message: "model does not exist",
      });
    }

    // Check if the componentID exists
      const existingComponent = await Component.findOne({ componentID });
      if (!existingComponent) {
        return res.status(400).json({
          success: false,
          message: "Component does not exist",
        });
      }

    // Create the hardware
    const newHardware = await Hardware.create({
      hardwareID,
      componentID,
      name,
      type,
      manufacturer,
      manufacture_date,
      modelID,
      installation_date,
      installed_version,
      properties,
    });

    return res.status(200).json({
      success: true,
      message: "hardware added successfully",
      data: newHardware,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const get_hardwares = async (req: Request, res: Response) => {
  try {
    const data = await Hardware.find();
    if (data.length != 0) {
      res.status(200).json({
        success: true,
        data: data,
      });
    } else {
      res.status(200).json({
        success: false,
        message: "no updates",
        data: []
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const add_model = async (req: Request, res: Response) => {
  try {
    const { modelID, model_name, company_name, latest_version } = req.body;

    await Model.find({ modelID: modelID }).then(async (data) => {
      if (data.length != 0)
        return res.status(400).json({
          success: false,
          message: "model already exist",
        });
      else {
        await Model.create({
          modelID,
          company_name,
          model_name,
          latest_version,
        })
          .then((data) => {
            return res.status(200).json({
              success: true,
              message: "model created successfully",
              data: data ?? {},
            });
          })
          .catch((err) => {
            console.log(err);
            return res.status(500).json({
              success: false,
              message: "some error occured",
            });
          });
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const update_model = async (req: Request, res: Response) => {
  try {
    const { company_name, model_name, latest_version } = req.body;
    console.log(req.body);

    const existingModel = await Model.findOne({ $or:[{model_name: model_name}, {company_name: company_name}] });
    console.log(existingModel);

    if (!existingModel) {
      return res.status(400).json({
        success: false,
        message: "Model not found",
      });
    }

    existingModel.latest_version = latest_version;
    await existingModel.save();
    console.log(existingModel.modelID);

    const hardwares = await Hardware.find({
      modelID: existingModel.modelID,
      installed_version: { $ne: latest_version },
    });
    console.log(hardwares);

    for (let i = 0; i < hardwares.length; i++) {
      await HardwareUpdate.create({
        modelID: existingModel.modelID,
        hardwareID: hardwares[i].hardwareID,
        latest_version: latest_version,
        installed_version: hardwares[i].installed_version,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Model updated successfully",
      data: existingModel ?? {},
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const get_models = async (req: Request, res: Response) => {
  try {
    const data = await Model.find();
    if (data.length != 0) {
      res.status(200).json({
        success: true,
        data: data,
      });
    } else {
      res.status(200).json({
        success: false,
        message: "no updates",
        data: []
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const get_updates = async (req: Request, res: Response) => {
  try {
    const completedUpdates = await HardwareUpdate.aggregate([
      {
        $match: {
          status: "yes" 
        }
      },
      {
        $lookup: {
          from: "hardwares",
          localField: "hardwareID",
          foreignField: "hardwareID",
          as: "hardwareDetails"
        }
      },
      {
        $unwind: "$hardwareDetails"
      },
      {
        $sort: {
          "hardwareDetails.installed_version": -1 
        }
      },
      {
        $group: {
          _id: "$hardwareID",
          hardwareName: { $first: "$hardwareDetails.name" }, 
          updatedAt: { $first: "$hardwareDetails.installation_date" }, 
          installed_version: { $first: "$hardwareDetails.installed_version" } 
        }
      },
      {
        $project: {
          _id: 0,
          hardwareName: 1,
          updatedAt: 1,
          installed_version: 1
        }
      }
    ]);
    console.log(completedUpdates);

    const pendingUpdates = await HardwareUpdate.aggregate([
      {
        $match: {
          status: "no" 
        }
      },
      {
        $lookup: {
          from: "hardwares",
          localField: "hardwareID",
          foreignField: "hardwareID",
          as: "hardwareDetails"
        }
      },
      {
        $unwind: "$hardwareDetails"
      },
      {
        $project: {
          _id: 0, 
            hardwareID: "$hardwareDetails.hardwareID",
            releaseDate: "$createdAt",
          hardwareName: "$hardwareDetails.name", 
          installed_version: "$hardwareDetails.installed_version", 
          latest_version: 1 
        }
      }
    ]);
    console.log(pendingUpdates);
    return res.status(200).json({
      succes: true,
      completedUpdates,
      pendingUpdates
    })
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


const mark_updates = async (req: Request, res: Response) => {
  try {
    const { hardwareID } = req.body;
    const existingHardware = await Hardware.findOne({ hardwareID: hardwareID });

    if (!existingHardware) {
      return res.status(400).json({
        success: false,
        message: "hardware does not exist",
      });
    }

    // Update the hardware
    const markedHardware = await HardwareUpdate.findOneAndUpdate(
      { hardwareID: hardwareID },
      { status: "yes" }
    );

    const cur = new Date();
    console.log(cur);
    const updatedHardware = await Hardware.findOneAndUpdate(
      { hardwareID: hardwareID },
      {
        $set: {
          installed_version: markedHardware?.latest_version,
          installation_date: cur
        }
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Hardware update marked done",
      data: updatedHardware ?? {},
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


const get_hardware_details = async(req: Request, res: Response)=>{
  try{
    const counts = await Hardware.aggregate([
      {
        $group: {
          _id: null,
          totalHardware: { $sum: 1 } 
        }
      },
      {
        $lookup: {
          from: "hardware_updates",
          localField: "_id",
          foreignField: "hardwareId",
          as: "updates"
        }
      },
      {
        $unwind: "$updates"
      },
      {
        $match: {
          "updates.status": "no" 
        }
      },
      {
        $group: {
          _id: null,
          pendingUpdate: { $sum: 1 },
          totalHardware: { $first: "$totalHardware" } 
        }
      },
      {
        $project: {
          _id: 0,
          totalHardware: 1,
          pendingUpdate: 1,
          patchedDevices: { $subtract: ["$totalHardware", "$pendingUpdate"] } 
        }
      }
    ]);
    console.log(counts);
    const hardwareData = await Hardware.aggregate([
      {
        $lookup: {
          from: "hardware_updates",
          localField: "hardwareID",
          foreignField: "hardwareID",
          as: "updates"
        }
      },
      {
        $unwind: "$updates" // Unwind the updates array
      },
      {
        $group: {
          _id: "$type",
          hardwareIds: { $push: "$hardwareID" }, // Collect hardware IDs in each group
          totalHardware: { $sum: 1 }, // Count the total hardware in each category type
          hardwareToUpdate: {
            $sum: {
              $cond: [
                { $eq: ["$updates.status", "no"] }, // Check if status is "no"
                1, // If status is "no", count as 1
                0 // If not, count as 0
              ]
            }
          } // Count hardware to be updated with status "no"
        }
      },
      {
        $project: {
          _id: 1, // Include _id (type)
          hardwareIds: 1, // Include hardwareIds
          totalHardware: 1, // Include totalHardware
          hardwareToUpdate: 1, // Include hardwareToUpdate
          patchedDevices: { $subtract: ["$totalHardware", "$hardwareToUpdate"] } // Calculate patched devices
        }
      }
    ]);
    console.log(hardwareData);
    return res.status(200).json({
      success: true,
      counts,
      hardwareData      
    });
  }
  catch(err){
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export {
  add_hardware,
  get_hardwares,
  add_model,
  update_model,
  get_models,
  get_updates,
  mark_updates,
  get_hardware_details
};
