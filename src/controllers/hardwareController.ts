import Hardware from "../models/hardware";
import HardwareUpdate from "../models/hardware_updates";
import Model from "../models/models";
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
    //   const existingComponent = await Component.findOne({ componentID });
    //   if (!existingComponent) {
    //     return res.status(400).json({
    //       success: false,
    //       message: "Component does not exist",
    //     });
    //   }

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
    res.status(500).json({
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
    const { model_name, company_name, latest_version } = req.body;

    const existingModel = await Model.findOne({ $or:[{model_name: model_name}, {company_name: company_name}] });

    if (!existingModel) {
      return res.status(400).json({
        success: false,
        message: "Model not found",
      });
    }

    existingModel.latest_version = latest_version;
    await existingModel.save();

    const hardwares = await Hardware.find({
      modelID: existingModel.modelID,
      installed_version: { $ne: latest_version },
    });

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
    const data = await HardwareUpdate.find({ status: "no" });
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

    const updatedHardware = await Hardware.findOneAndUpdate(
      { hardwareID: hardwareID },
      { installed_version: markedHardware?.latest_version }
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

export {
  add_hardware,
  get_hardwares,
  add_model,
  update_model,
  get_models,
  get_updates,
  mark_updates,
};
