import { Request, Response } from "express";
import Component from "../models/components";
import Nanogrid from "../models/nanogrids";
import Type from "../models/types";

const add_component = async (req: Request, res: Response) => {
  try {
    var { componentID, name, type, latitude, longitude, capacity, properties } =
      req.body;
    componentID = componentID.toUpperCase();
    const existingComponent = await Component.findOne({
      $or: [{ componentID: componentID }, { name: name }],
    });
    if (existingComponent) {
      return res.status(400).json({
        success: false,
        message: "component already exists",
      });
    }

    type = type.toLowerCase();
    const typeid = await Type.findOne({ name: type });

    const data = await Component.create({
      componentID: componentID,
      name: name,
      type: typeid?._id,
      latitude: latitude,
      longitude: longitude,
      capacity: capacity,
      properties: properties,
    });

    res.status(200).json({
      success: true,
      message: "component added successfully",
      data: data ?? {},
    });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const add_type = async (req: Request, res: Response) => {
  try {
    const { name, source_type } = req.body;
    const data = await Type.create({
      name: name.toLowerCase(),
      source_type: source_type,
    });

    return res.status(200).json({
      success: true,
      message: "type added successfully",
      data: data,
    });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const add_nanogrid = async (req: Request, res: Response) => {
  try {
    const { nanogridID, name, components } = req.body;

    const existingNanogrid = await Nanogrid.findOne({
      $or: [{ nanogridID: nanogridID }, { name: name }],
    });

    if (existingNanogrid) {
      return res.status(400).json({
        success: false,
        message: "nanogrid already exists",
      });
    }

    const data = await Nanogrid.create({
      nanogridID: nanogridID,
      name: name,
      components: components,
    });

    return res.status(200).json({
      success: true,
      message: "nanogrid added successfully",
      data: data,
    });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const add_nanogrid_component = async (req: Request, res: Response) => {
  try {
    const { name, components } = req.body;

    const existingNanogrid = await Nanogrid.findOne({ name: name });

    if (!existingNanogrid) {
      return res.status(404).json({
        success: false,
        message: "Nanogrid not found",
      });
    }

    const updatedComponents = [...components, ...existingNanogrid.components];

    existingNanogrid.components = updatedComponents;

    const updatedNanogrid = await existingNanogrid.save();

    return res.status(200).json({
      success: true,
      message: "Component added successfully",
      data: updatedNanogrid,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getActiveComponents = async (req: Request, res: Response) => {
  try {
    const type = req.params.type;
    const pipeline = [
      {
        $lookup: {
          from: "types",
          localField: "type",
          foreignField: "_id",
          as: "typeInfo",
        },
      },
      {
        $unwind: "$typeInfo",
      },
      {
        $match: {
          "typeInfo.source_type": type,
        },
      },
      {
        $project: {
          componentID: 1,
          name: 1,
          latitude: 1,
          longitude: 1,
          capacity: 1,
          properties: 1,
          type: "$typeInfo.name",
        },
      },
    ];
    const result = await Component.aggregate(pipeline);
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {}
};

export {
  add_component,
  add_type,
  add_nanogrid,
  add_nanogrid_component,
  getActiveComponents,
};
